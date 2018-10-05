import React from "react";
import { View, Image } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Text,
  List,
  ListItem
} from "native-base";
import { cblProvider } from "react-native-cbl";

@cblProvider(props => ({
  note: {
    docId: props.navigation.state.params.noteId
  }
}))
export default class NoteScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Note",
    headerRight: (
      <Button
        transparent
        onPress={() =>
          navigation.navigate("NoteModal", {
            noteId: navigation.state.params.noteId
          })
        }
      >
        <Text>Edit</Text>
      </Button>
    )
  });

  render() {
    if (!this.props.note._id) {
      return (
        <Container>
          <Content>
            <Text>Note was deleted</Text>
          </Content>
        </Container>
      );
    }

    return (
      <Container>
        <Content>
          <List>
            <ListItem>
              <View>
                <Text>Title: {this.props.note.title}</Text>
              </View>
            </ListItem>
            <ListItem>
              <View>
                <Text>Text: {this.props.note.text}</Text>
              </View>
            </ListItem>
            {/* <ListItem>
              <View>
                <Text>Photo:</Text>
                {
                  this.props.note && this.props.note._attachments && this.props.note._attachments.photo
                    ? <Image source={{uri: this.props.note._attachments.photo.url}} style={{width: 200, height: 200}} />
                    : null
                }
              </View>
            </ListItem> */}
          </List>
        </Content>
      </Container>
    );
  }
}
