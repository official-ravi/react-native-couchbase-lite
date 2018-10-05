import React from "react";
import { View } from "react-native";
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
  notes: {
    view: "main/notes"
  }
}))
export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Notes",
    headerRight: (
      <Button transparent onPress={() => navigation.navigate("NoteModal")}>
        <Text>Add</Text>
      </Button>
    )
  });

  onListItemClick = noteId => {
    this.props.navigation.navigate("Note", { noteId });
  };

  render() {
    console.log(this.props.notes, " this.props.notes this.props.notes");
    return (
      <Container>
        <Content>
          <List>
            {this.props.notes.map(note => (
              <ListItem
                key={note._id}
                onPress={() => this.onListItemClick(note._id)}
              >
                <View>
                  <Text>{note.title}</Text>
                  <Text>{note.text}</Text>
                </View>
              </ListItem>
            ))}
          </List>
        </Content>
      </Container>
    );
  }
}
