import { useState } from "react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Mock conversations
  const conversations = [
    {
      id: 1,
      name: "Priya Kashyap",
      studentId: "CS21B089",
      lastMessage: "Sure, let's discuss the room swap",
      timestamp: "2 hours ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Arjun Joshi",
      studentId: "CS21B012",
      lastMessage: "I'm interested in the chain swap",
      timestamp: "5 hours ago",
      unread: 0,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with other students about swap opportunities</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start chatting when you send or receive swap requests</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedChat === conversation.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                          {getInitials(conversation.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">
                              {conversation.name}
                            </p>
                            {conversation.unread > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{conversation.studentId}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400">{conversation.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                      {getInitials(conversations.find(c => c.id === selectedChat)?.name || "")}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {conversations.find(c => c.id === selectedChat)?.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {conversations.find(c => c.id === selectedChat)?.studentId}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex flex-col h-96">
                  {/* Messages Area */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                        {getInitials(conversations.find(c => c.id === selectedChat)?.name || "")}
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                        <p className="text-sm">Hi! I saw your room swap request. I'm interested in discussing a potential swap.</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 justify-end">
                      <div className="bg-primary text-white rounded-lg p-3 max-w-xs">
                        <p className="text-sm">Great! Let's discuss the details. What's your current room situation?</p>
                        <p className="text-xs text-blue-100 mt-1">1 hour ago</p>
                      </div>
                      <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                        You
                      </div>
                    </div>
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p>Choose a conversation from the left to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
