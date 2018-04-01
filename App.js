/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text } from 'native-base'
import { StyleSheet, View } from 'react-native'

import CouchbaseLite, { cblProvider } from 'react-native-cbl';

const views = {
  notes: {
    map: function(doc) {
      if (doc.docType == 'note') {
        emit(doc.dateCreated, null)
      }
    }.toString(),
  },
}

CouchbaseLite.openDb('odygos', false).then( () =>
  CouchbaseLite.updateDocument( '_design/main', { views } )
)

type Props = {}

@cblProvider( props => ({
  notes: {
    view: 'main/notes',
  },
}))
export default class App extends Component<Props> {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Text>
            This is Content Section
          </Text>
        </Content>
      </Container>
    )
  }
}
