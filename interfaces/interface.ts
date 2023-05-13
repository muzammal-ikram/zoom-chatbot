interface CompliancePayload {
  client_id: string;
  user_id: string;
  account_id: string;
  deauthorization_event_received: any;
}

export interface ComplianceRequestBody {
  client_id: string;
  user_id: string;
  account_id: string;
  deauthorization_event_received: CompliancePayload;
  compliance_completed: boolean;
}

export interface UnsplashRequestBody {
  event: string;
  payload: {
    accountId: string;
    channelName: string;
    cmd: string;
    robotJid: string;
    timestamp: number;
    toJid: string;
    triggerId: string;
    userId: string;
    userJid: string;
    userName: string;
  };
}

export interface ChatRequestBody {
  robot_jid: string;
  to_jid: string;
  account_id: string;
  user_jid: string;
  content: {
    head: {
      text: string;
    };
    body: any;
  };
}

interface PhotoSection {
  type: string;
  img_url: string;
  resource_url: string;
  information: {
    title: {
      text: string;
    };
    description: {
      text: string;
    };
  };
}

export interface Photo {
  type: string;
  sidebar_color: string;
  sections: Array<PhotoSection>;
}
