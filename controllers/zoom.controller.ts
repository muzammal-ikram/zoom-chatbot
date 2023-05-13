import axios, { AxiosResponse } from 'axios';
import pool from '../dbConfig';
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import {
  ComplianceRequestBody,
  UnsplashRequestBody,
  Photo,
  ChatRequestBody,
} from '../interfaces/interface';

const zoomClientId: string = process.env.ZOOM_CLIENT_ID;
const zoomClientSecret: string = process.env.ZOOM_CLIENT_SECRET;

export const getPhoto = async (body): Promise<AxiosResponse<any>> => {
  return axios.get(
    `https://api.unsplash.com/photos/random?query=${body.payload.cmd}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );
};

export const sendChat = async (
  body: UnsplashRequestBody,
  photo: Array<Photo>,
  token: string
): Promise<AxiosResponse<any>> => {
  const requestBody: ChatRequestBody = {
    robot_jid: process.env.ZOOM_BOT_JID,
    to_jid: body.payload.toJid,
    account_id: body.payload.accountId,
    user_jid: body.payload.userJid,
    content: {
      head: {
        text: '/unsplash ' + body.payload.cmd,
      },
      body: photo,
    },
  };
  return axios.post('https://api.zoom.us/v2/im/chat/messages', requestBody, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
};

export const getChatbotToken = async (): Promise<string> => {
  const query = await pool.query('SELECT * FROM chatbot_token');
  let token = '';
  if (query && query.rows && query.rows.length > 0) {
    if (query.rows[0].expires_on > new Date().getTime() / 1000) {
      token = query.rows[0].token;
    } else {
      const response = await axios.post(
        'https://api.zoom.us/oauth/token?grant_type=client_credentials',
        null,
        {
          headers: {
            Authorization:
              'Basic ' + Buffer.from(zoomClientId + ':' + zoomClientSecret).toString('base64'),
          },
        }
      );
      if (response.data) {
        await pool.query(
          `UPDATE chatbot_token SET token = '${response.data.access_token}', expires_on = ${
            new Date().getTime() / 1000 + response.data.expires_in
          }`
        );
        token = response.data.access_token;
      }
    }
  }
  await pool.end();
  return token;
};

export const Authorize = (_req: Request, res: Response): void => {
  res.redirect('https://zoom.us/launch/chat?jid=robot_' + process.env.ZOOM_BOT_JID);
};

export const DeAuthorize = (_req, res): void => {
  if (_req.headers.authorization === process.env.zoom_verification_token) {
    const requestBody: ComplianceRequestBody = {
      client_id: _req.body.payload.client_id,
      user_id: _req.body.payload.user_id,
      account_id: _req.body.payload.account_id,
      deauthorization_event_received: _req.body.payload,
      compliance_completed: true,
    };

    axios
      .post('https://api.zoom.us/oauth/data/compliance', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + Buffer.from(zoomClientId + ':' + zoomClientSecret).toString('base64'),
          'cache-control': 'no-cache',
        },
      })
      .then((response) => {
        return res.send(response.data);
      })
      .catch(() => {
        return res.send('Error to Unauthorized request to Unsplash Chatbot for Zoom.');
      });
  } else {
    res.status(401);
    return res.send('Unauthorized request to Unsplash Chatbot for Zoom.');
  }
};

export const UnSplash = async (_req: Request, res: Response) => {
  try {
    const accessToken = await getChatbotToken();
    if (accessToken) {
      const photoResponse = await getPhoto(_req.body);
      if (photoResponse.data) {
        const photo: Array<Photo> = [
          {
            type: 'section',
            sidebar_color: photoResponse.data.color,
            sections: [
              {
                type: 'attachments',
                img_url: photoResponse.data.urls.regular,
                resource_url: photoResponse.data.links.html,
                information: {
                  title: {
                    text: 'Photo by ' + photoResponse.data.user.name,
                  },
                  description: {
                    text: 'Click to view on Unsplash',
                  },
                },
              },
            ],
          },
        ];
        const sent = await sendChat(_req.body, photo, accessToken);
        if (sent.data) {
          return res.send('chat sent successfully!');
        }
        return res.send('Error sending chat.');
      }
      return res.send('Error getting photo from Unsplash.');
    }
    return res.send('Error getting chatbot_token from Zoom.');
  } catch (error) {
    return res.send('Something Went Wrong!');
  }
};
