import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import HomeScreen from './src/home-screen'
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

CouchbaseLite.openDb('odygos', false).then( () =>
  CouchbaseLite.updateDocument( '_design/main', { views } )
)

export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  NoteModal: {
    screen: NoteModalScreen,
  },
},{
  mode: 'modal',
  headerMode: 'none',
})
