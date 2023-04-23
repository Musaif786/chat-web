import React from "react";
import ChatBot from "react-simple-chatbot";
import { Segment } from "semantic-ui-react";
import { ThemeProvider } from "styled-components"

export const Chatbot = () => {
    const theme = {
        background: '#f5f8fb',
        fontFamily: "Roboto",
        headerBgColor: 'rgb(26, 186, 226)',
        headerFontColor: '#fff',
        headerFontSize: '15px',
        botBubbleColor: 'rgb(26, 186, 226)',
        botFontColor: '#fff',
        userBubbleColor: '#fff',
        userFontColor: '#4a4a4a',
      };
  const steps = [
    {
      id: "Greet",

      message: "Hello, Welcome to Musaif chatting website..",

      trigger: "Done",
    },

    {
      id: "Done",

      message: "Please enter your name!",

      trigger: "waiting1",
    },

    {
      id: "waiting1",

      user: true,

      trigger: "Name",
    },

    {
      id: "Name",

      message: "Hi {previousValue}, How may i assist you",

      trigger: "issues",
    },

    {
      id: "issues",

      options: [
        {
          value: "Logging issue",

          label: "Logging issue",

          trigger: "login",
        },

        { value: "forgot Password", label: "forgot Password", trigger: "forgot Password" },
      ],
    },

    {
      id: "login",

      message:
        "Thanks for letting your Login issue, Please contact me on Whatsapp ( 7995587687 ) issue ASAP",

      end: true,
    },

    {
      id: "forgot Password",

      message:
        "Thanks for letting your forgot ID/Password issue, Please click on forgot password and get you password on your registered email id, Thank you.",

      end: true,
    },
  ];
  return (
    <Segment floated="right">
     <ThemeProvider theme={theme}>
     <ChatBot floating="false" headerTitle="Musaif-Assistant" steps={steps} height="290px" width="220px" />
  </ThemeProvider>
    </Segment>
  );
};
