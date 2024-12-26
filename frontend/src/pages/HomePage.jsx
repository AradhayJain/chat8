import { Container,Box,Text,Tabs} from '@chakra-ui/react';
import Login from '../component/authentication/Login';
import Singup from '../component/authentication/Singup';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import '/src/css/home.css'; // Correct relative import for CSS file





// import {LuCheckSquare,LuFolder,LuUser} from "react-icons/lu"
function Homepage() {
  const navigate = useNavigate(); // Changed from `useHistory`

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("userInfo"));
  //   if (user) navigate("/chats"); 
  // }, [navigate]);

  return (
    
     <div className="home">
       <Container  className="home-container" maxW="2xl" centerContent>
          <Box
          d="flex"
          justifyContent="center"
          p={3}
          bg="white"
          w="160%"
          m="50px 0 15px 0"
          textAlign="center"
          borderRadius="lg"
          borderWidth="1px">
            <Text fontSize="4xl" fontFamily="Work sans">Talk-A-Tive</Text>
          </Box>
          <Box  w="160%" p={4} borderRadius="lg" borderWidth="1px">
              <Tabs.Root defaultValue="members">
                <Tabs.List>
                  <Tabs.Trigger textAlign="center" width="50%" value="members">
                  
                    signup
                  </Tabs.Trigger>
                  <Tabs.Trigger textAlign="center" width="50%" value="projects">
                   
                    login
                  </Tabs.Trigger>
                  
                </Tabs.List>
                <Tabs.Content value="members"><Singup/></Tabs.Content>
                <Tabs.Content value="projects"><Login/></Tabs.Content>
                
              </Tabs.Root>
          </Box>

       </Container>
        
        
     </div>
    
    
  );
}

export default Homepage;
