import { getCachedAccessToken } from './firebase';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface GmailMessageItem {
  id: string;
  threadId: string;
  snippet: string;
  subject?: string;
  from?: string;
  date?: string;
}

export interface KeepNoteItem {
  id: string;
  title: string;
  body: string;
  isPinned: boolean;
  color?: string;
  updatedAt: string;
}

// 1. GOOGLE DRIVE API CALLS
export async function listGoogleDriveFiles(): Promise<DriveFileItem[]> {
  const token = getCachedAccessToken();
  if (!token) {
    // Return sample connected drive files if unauthenticated or testing
    return [
      {
        id: 'drive_doc_1',
        name: 'Q4 Product Roadmap & Launch Plan.docx',
        mimeType: 'application/vnd.google-apps.document',
        modifiedTime: '2 hours ago',
        webViewLink: 'https://docs.google.com',
      },
      {
        id: 'drive_sheet_2',
        name: 'Sprint #44 Budget & Escrow Ledger.xlsx',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        modifiedTime: 'Yesterday',
        webViewLink: 'https://sheets.google.com',
      },
      {
        id: 'drive_slide_3',
        name: 'Executive Keynote Deck.pptx',
        mimeType: 'application/vnd.google-apps.presentation',
        modifiedTime: '3 days ago',
        webViewLink: 'https://slides.google.com',
      },
    ];
  }

  try {
    const res = await fetch(
      'https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,modifiedTime,webViewLink,iconLink)',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error(`Drive fetch error: ${res.statusText}`);
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.warn('Drive API notice:', err);
    return [];
  }
}

// 2. GMAIL API CALLS
export async function listGmailThreads(): Promise<GmailMessageItem[]> {
  const token = getCachedAccessToken();
  if (!token) {
    return [
      {
        id: 'mail_1',
        threadId: 'th_1',
        from: 'Alex Rivera <alex@engineering.corp>',
        subject: 'URGENT: Staging Build #402 Delay',
        snippet: 'Hey team, VP of client ops is pinging about the auth token patch...',
        date: '10:42 AM',
      },
      {
        id: 'mail_2',
        threadId: 'th_2',
        from: 'Sarah Jenkins <cfo@apexcorp.io>',
        subject: 'Invoice #8819 Inquiry',
        snippet: 'We noticed an unexpected $240 charge on our corporate invoice...',
        date: '9:15 AM',
      },
      {
        id: 'mail_3',
        threadId: 'th_3',
        from: 'Google Workspace Team',
        subject: 'Security Alert: New device logged into Omni Keyboard',
        snippet: 'Your Google Account was authorized on mobile keyboard...',
        date: 'Yesterday',
      },
    ];
  }

  try {
    const listRes = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!listRes.ok) throw new Error(`Gmail list error: ${listRes.statusText}`);
    const listData = await listRes.json();
    const messages = listData.messages || [];

    const detailed: GmailMessageItem[] = [];
    for (const msg of messages.slice(0, 5)) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (msgRes.ok) {
        const d = await msgRes.json();
        const headers = d.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
        detailed.push({
          id: d.id,
          threadId: d.threadId,
          snippet: d.snippet,
          subject,
          from,
          date,
        });
      }
    }
    return detailed;
  } catch (err) {
    console.warn('Gmail API notice:', err);
    return [];
  }
}

// Send Email via Gmail API
export async function sendGmail(to: string, subject: string, body: string): Promise<boolean> {
  const token = getCachedAccessToken();
  if (!token) {
    console.log(`[Simulated Gmail Send] To: ${to}, Subject: ${subject}`);
    return true;
  }

  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ];
  const emailRaw = emailLines.join('\r\n');
  const base64Safe = btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: base64Safe }),
  });

  return res.ok;
}

// 3. GOOGLE KEEP NOTES INTEGRATION (Synced locally & to user Firestore notes)
export const DEFAULT_KEEP_NOTES: KeepNoteItem[] = [
  {
    id: 'keep_1',
    title: 'Deployment Checklist 🚀',
    body: '1. Verify auth bearer token\n2. Run regression suite\n3. Push staging build\n4. Notify VP in Slack',
    isPinned: true,
    color: 'amber',
    updatedAt: '10 mins ago',
  },
  {
    id: 'keep_2',
    title: 'Executive Talking Points 💼',
    body: '- Reassure timeline confidence\n- Highlight 0-regression pass rate\n- Schedule follow-up sync for 3 PM',
    isPinned: true,
    color: 'cyan',
    updatedAt: '1 hour ago',
  },
  {
    id: 'keep_3',
    title: 'Weekend Cabin Packing 🌲',
    body: 'Warm sweaters, board games, marshmallows, portable charger, hiking boots',
    isPinned: false,
    color: 'emerald',
    updatedAt: 'Yesterday',
  },
];
