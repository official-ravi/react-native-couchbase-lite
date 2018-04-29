import React, { Component } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { StackNavigator } from 'react-navigation'
import HomeScreen from './src/home-screen'
import NoteScreen from './src/note-screen'
import NoteModalScreen from './src/note-modal-screen'
import CouchbaseLite from 'react-native-cbl'

const views = {
  notes: {
    map: function(doc) {
      if (doc.docType == 'note') {
        emit(doc.createdTime, null)
      }
    }.toString(),
  },
}

const syncGateWayHost = Platform.OS == 'android' ? '10.0.2.2' : 'localhost'
const dbName = 'notes'

CouchbaseLite.openDb(dbName, false).then( () => {
  CouchbaseLite.updateDocument( '_design/main', { views } )
  CouchbaseLite.startReplication( `http://${syncGateWayHost}:4984/${dbName}/`, null )
})

export default StackNavigator({
  Root: {
    screen: StackNavigator({
      Home: {
        screen: HomeScreen,
      },
      Note: {
        screen: NoteScreen,
      },
    })
  },
  NoteModal: {
    screen: NoteModalScreen,
  },
},{
  mode: 'modal',
  headerMode: 'none',
})
