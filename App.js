import React, { Component } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { StackNavigator } from "react-navigation";
import HomeScreen from "./src/home-screen";
import NoteScreen from "./src/note-screen";
import NoteModalScreen from "./src/note-modal-screen";
import CouchbaseLite, { CBLConnection, CBLConnector } from "react-native-cbl";

const views = {
  notes: {
    map: function(doc) {
      if (doc.docType == "note") {
        emit(doc.createdTime, null);
      }
    }.toString()
  }
};
const syncGatewayHost = Platform.OS == "android" ? "localhost" : "localhost";
const dbName = "notes";
const syncGatewayUrl = `http://${syncGatewayHost}:4984/${dbName}/`;
console.log(syncGatewayUrl, "syncGatewayUrlsyncGatewayUrlsyncGatewayUrl");
const StackNavigatorApp = StackNavigator(
  {
    Root: {
      screen: StackNavigator({
        Home: {
          screen: HomeScreen
        },
        Note: {
          screen: NoteScreen
        }
      })
    },
    NoteModal: {
      screen: NoteModalScreen
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const cblConnection = new CBLConnection({
  dbName,
  syncGatewayUrl,
  views
});

const REPLICATION_OPTIONS = {
  continuous: true
};
export default class App extends React.Component {
  render() {
    return (
      <CBLConnector connection={cblConnection}>
        <StackNavigatorApp />
      </CBLConnector>
    );
  }
}
