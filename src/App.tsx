/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { Container, Content, Footer, FlexboxGrid, Button, Icon } from "rsuite";

import AppContext from "./contexts/useApp";

import GoogleAuthContext from "./contexts/useGoogleAuth";
import { useGoogle } from "./hooks/useGoogle";

import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Spinner from "./components/Spinner/Spinner";
import Timer from "./components/Timer/Timer";
import Summary from "./components/Summary/Summary";

import "rsuite/dist/styles/rsuite-dark.css";
import logo from "./logo-detonate-white.svg";

const discoveryDocs = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];
const scope = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.metadata"
].join(" ");

const App = () => {
  const googleAuth = useGoogle({
    apiKey: process.env.REACT_APP_GOOGLE_APP_ID,
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    discoveryDocs,
    scope,
    spreadsheetId: "1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48",
    tableName: "aSa"
  });

  const [running, setRunning] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [range, setRange] = React.useState("");

  const toggleRunning = (state: boolean) => {
    setRunning(state);
  };

  const toggleReload = () => {
    setReload(!reload);
  };

  const toggleRange = (range: string) => {
    setRange(range);
    console.log(range);
  };

  return (
    <AppContext.Provider
      value={{
        locale: "de-DE",
        running: running,
        toggleRunning: toggleRunning,
        reload: reload,
        toggleReload: toggleReload,
        range: range,
        toggleRange: toggleRange
      }}
    >
      <GoogleAuthContext.Provider value={googleAuth}>
        {googleAuth.isInitialized ? (
          <Container>
            {googleAuth.isSignedIn ? (
              <React.Fragment>
                <Header logo={logo} />
                <Content
                  style={{
                    marginTop: "56px"
                  }}
                >
                  <Timer />
                  <Summary />
                </Content>
                <Footer
                  style={{
                    padding: "0px 0px 20px"
                  }}
                >
                  <FlexboxGrid justify="center">
                    <Button
                      target="_blank"
                      href={`https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=${googleAuth.sheetProperties?.sheetId}`}
                      appearance="ghost"
                    >
                      <Icon icon="google" />
                      See more on Google Sheets
                    </Button>
                  </FlexboxGrid>
                </Footer>
              </React.Fragment>
            ) : (
              <Login />
            )}
          </Container>
        ) : (
          <Spinner />
        )}
      </GoogleAuthContext.Provider>
    </AppContext.Provider>
  );
};

export default App;
