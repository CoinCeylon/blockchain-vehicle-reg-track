import React, { useCallback, useState, createContext, useContext } from 'react';
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => void;
  clearChat: () => void;
  isChatOpen: boolean;
  toggleChat: () => void;
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);

const botResponses: Record<string, string> = {
  hello: 'Hello! How can I help you with vehicle registration today?',
  hi: 'Hi there! Do you need help with vehicle registration or ownership transfer?',
  help: 'I can help you with: vehicle registration, ownership verification, document upload, and more. What do you need assistance with?',
  register: "To register a vehicle, go to Dashboard > Register Vehicle and enter the chassis number, license plate, and upload the required documents. You'll need to connect your Cardano wallet (Lace or Eternl) to complete the transaction.",
  transfer: "To transfer vehicle ownership, go to Dashboard > Transfer Ownership. You'll need the new owner's wallet address and your connected Cardano wallet to sign the transaction.",
  search: 'You can search for a vehicle by license plate or chassis number in the Search section of your dashboard. This will show you the complete blockchain history of the vehicle.',
  wallet: 'We support Cardano wallets like Lace and Eternl. Lace is recommended for regular users, while Eternl is preferred for administrators and developers. You can connect your wallet from the login page or your profile.',
  documents: 'You can upload vehicle documents like proof of purchase, insurance, and emissions certificates in the vehicle details page. These documents are securely stored using blockchain technology.',
  blockchain: 'Vcrypt uses the Cardano blockchain to ensure secure, transparent vehicle registration. Every transaction is recorded on the blockchain, making it impossible to tamper with vehicle records.',
  cardano: "Cardano is a proof-of-stake blockchain platform that provides the security and transparency needed for vehicle registration. We use Cardano's smart contract capability to automate and secure vehicle ownership transfers.",
  admin: 'Administrators have full authority over the system, including managing users, overseeing all vehicle records, resolving disputes, and monitoring flagged activities.',
  officer: 'Registration officers are responsible for verifying vehicle documents, approving registrations, and assisting with ownership transfers. They help maintain the accuracy of the vehicle database.',
  owner: 'Vehicle owners can connect their Cardano wallets to view their vehicle details, upload documents, and initiate ownership transfers. All transactions are secured by blockchain technology.',
  fees: "Registration fees are paid in ADA, Cardano's native cryptocurrency. The exact fee depends on the type of vehicle and transaction. You can view the current fee schedule in the dashboard.",
  security: 'Vcrypt ensures security through blockchain technology, which creates immutable records of all transactions. Your data is encrypted and only accessible to authorized parties.',
  verification: "Vehicle ownership verification is done through blockchain records. Each vehicle has a unique identifier linked to the owner's wallet address, making verification simple and secure.",
  mesh: 'We use Mesh SDK for seamless integration with the Cardano blockchain. It allows for secure wallet connections and transaction signing.',
  blockfrost: 'Blockfrost API is used to interact with the Cardano blockchain, making it easy to query transaction history and verify ownership records.',
  aiken: 'Our smart contracts are written in Aiken, an efficient language for creating Plutus contracts on Cardano. This ensures that all transactions are secure and follow predefined rules.'
};
export const ChatProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "Hello! I'm your Vcrypt assistant. How can I help you with blockchain-based vehicle registration today?",
    sender: 'bot',
    timestamp: new Date()
  }]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };
  const generateResponse = (text: string): string => {
    const lowerText = text.toLowerCase();

    for (const [keyword, response] of Object.entries(botResponses)) {
      if (lowerText.includes(keyword)) {
        return response;
      }
    }

    if (lowerText.includes('how') && lowerText.includes('work')) {
      return 'Vcrypt works by recording vehicle registration and ownership information on the Cardano blockchain. This creates a tamper-proof record that can be verified by anyone with the proper authorization. When you register a vehicle, the information is stored in a smart contract, and when you transfer ownership, a new transaction is created on the blockchain.';
    }
    if (lowerText.includes('what') && lowerText.includes('need')) {
      return "To use Vcrypt, you'll need a Cardano wallet (like Lace or Eternl), some ADA for transaction fees, and your vehicle documentation. Administrators and officers will need to log in with their credentials, while vehicle owners can connect directly with their wallets.";
    }
    
    if (lowerText.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with regarding vehicle registration or blockchain technology?";
    }
    return "I'm not sure I understand your question about vehicle registration. Can you try asking about registration process, ownership transfer, wallet connection, or blockchain security? I'm here to help with all aspects of the Vcrypt system.";
  };
  const sendMessage = useCallback((text: string) => {

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  }, []);
  const clearChat = useCallback(() => {
    setMessages([{
      id: 'welcome',
      text: "Hello! I'm your Vcrypt assistant. How can I help you with blockchain-based vehicle registration today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, []);
  return <ChatContext.Provider value={{
    messages,
    sendMessage,
    clearChat,
    isChatOpen,
    toggleChat
  }}>
      {children}
    </ChatContext.Provider>;
};
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};