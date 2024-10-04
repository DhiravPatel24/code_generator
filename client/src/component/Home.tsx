import  { useState } from 'react';
import { Layout,  Input, Button, Avatar, List, Typography, message } from 'antd';
import { SendOutlined,   UserOutlined, RobotOutlined } from '@ant-design/icons';
import axios from 'axios';
 // Import your CSS styles

const {   Content,  } = Layout;
const { Text } = Typography;

interface Message {
  text: string;
  sender: 'user' | 'bot';
  isCode?: boolean; // Determines if the message contains code
}

export default function Home() {
//   const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBotResponse = async (userMessage: string) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4242/generate-code', { prompt: userMessage });
      const botReply = response.data.code;

      const isCode = botReply.includes('def ') || botReply.includes('```') || botReply.includes('const');

      // Add the bot's response to the messages
      setMessages(prev => [...prev, { text: botReply, sender: 'bot', isCode }]);
    } catch (error) {
        console.log(error)
      message.error('Error fetching bot response');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
      fetchBotResponse(inputValue);
    }
  };

  return (
    <Layout style={{ maxHeight:'650px',height: '550px', overflow:'scroll' }}>
      {/* <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<PlusOutlined />}>New Chat</Menu.Item>
        </Menu>
      </Sider> */}
      {/* <Layout> */}
        {/* <Header style={{ padding: 0, background: '#fff' }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        </Header> */}
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff' }}>
            
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(item) => (
              <List.Item style={{ justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <List.Item.Meta
                  avatar={
                    <Avatar icon={item.sender === 'user' ? <UserOutlined /> : <RobotOutlined />} />
                  }
                  title={<Text strong>{item.sender === 'user' ? 'You' : 'ChatBot'}</Text>}
                  description={
                    item.isCode ? (
                      <div className="code-block">
                        <pre><code>{item.text}</code></pre>
                      </div>
                    ) : (
                      <Text>{item.text}</Text>
                    )
                  }
                  style={{
                    maxWidth: '70%',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: item.sender === 'user' ? '#e6f7ff' : '#f6ffed',
                  }}
                />
              </List.Item>
            )}
          />
            {/* <Footer style={{ padding: '10px 50px' , position:'fixed', width:'100%', bottom:'20px'}}> */}
          <Input.Group compact style={{ padding: '10px 100px 10px 20px' , position:'fixed', width:'100%', bottom:'20px'}}>
            <Input
              style={{ width: 'calc(100% - 40px)' }}
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSend}
              disabled={loading}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading} />
          </Input.Group>
        {/* </Footer> */}
        </Content>
      
      {/* </Layout> */}
    </Layout>
  );
}
