import React from 'react'
import { View } from 'react-native'
import { Container, Header, Title, Content, Button, Left, Right, Body, Text,
  List, ListItem } from 'native-base'
import { cblProvider } from 'react-native-cbl'

@cblProvider( props => ({
  notes: {
    view: 'main/notes',
  },
}))
export default class HomeScreen extends React.Component {
  onListItemClick = note => {
    this.props.navigation.navigate('NoteModal', { note })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>Notes</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('NoteModal')}
            ><Text>Add</Text></Button>
          </Right>
        </Header>
        <Content>
        <List>
          {
            this.props.notes.map( note =>
              <ListItem key={note._id} onPress={() => this.onListItemClick(note)}>
                <View>
                  <Text>{note.title}</Text>
                  <Text>{note.text}</Text>
                </View>
              </ListItem>
            )
          }
        </List>
        </Content>
      </Container>
    )
  }
}
