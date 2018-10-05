import React from "react";
import { Image, CameraRoll, Platform } from "react-native";
import {
  Container,
  Header,
  Footer,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Form,
  Item,
  Input
} from "native-base";
import CouchbaseLite, { cblProvider } from "react-native-cbl";
import ImagePicker from "react-native-image-picker";

@cblProvider(props => {
  const navParams = props.navigation.state.params;
  return navParams && navParams.noteId
    ? {
        note: {
          docId: navParams.noteId,
          live: false
        }
      }
    : {};
})
export default class NoteModalScreen extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      values:
        nextProps.note && nextProps.note._id
          ? { ...nextProps.note }
          : {
              title: "",
              text: ""
            }
    };
  }

  state = {};

  onValueChange(field, value) {
    this.setState(({ values }) => ({ values: { ...values, [field]: value } }));
  }

  onSaveButtonPress = async () => {
    if (this.props.note && this.props.note._id) {
      await CouchbaseLite.updateDocument(this.props.note._id, {
        title: this.state.values.title,
        text: this.state.values.text
      });
      if (this.state.attachmentUri) {
        await CouchbaseLite.addAttachment(
          this.state.attachmentUri,
          "photo",
          this.props.note._id
        );
      } else if (this.state.removeAttachment) {
        await CouchbaseLite.removeAttachment("photo", this.props.note._id);
      }
    } else {
      const docId = await CouchbaseLite.createDocument({
        title: this.state.values.title,
        text: this.state.values.text,
        createdTime: new Date(),
        docType: "note"
      });
      if (this.state.attachmentUri) {
        await CouchbaseLite.addAttachment(
          this.state.attachmentUri,
          "photo",
          docId
        );
      }
    }
    this.props.navigation.goBack();
  };

  onDeleteButtonPress = async () => {
    await CouchbaseLite.deleteDocument(this.props.note._id);
    this.props.navigation.goBack();
  };

  onAddAttachmentPress = async () => {
    ImagePicker.showImagePicker(
      {
        title: "Select attachment"
      },
      response => {
        const uri = response.origURL || response.uri;
        if (uri) {
          this.setState({
            attachmentUri: uri,
            removeAttachment: false
          });
        }
      }
    );
  };

  onRemoveAttachmentPress = () => {
    this.setState({
      removeAttachment: true,
      attachmentUri: null
    });
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Text>Cancel</Text>
            </Button>
          </Left>
          <Body>
            <Title>New note</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.onSaveButtonPress}>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item>
              <Input
                placeholder="Title"
                value={this.state.values.title}
                onChangeText={value => this.onValueChange("title", value)}
              />
            </Item>
            <Item last>
              <Input
                placeholder="Text"
                value={this.state.values.text}
                onChangeText={value => this.onValueChange("text", value)}
              />
            </Item>
            {!this.state.removeAttachment ? (
              this.state.attachmentUri ? (
                <Image
                  style={{ width: 100, height: 100 }}
                  source={{ uri: this.state.attachmentUri }}
                />
              ) : this.props.note &&
              this.props.note._id &&
              this.props.note._attachments &&
              this.props.note._attachments.photo ? (
                <Image
                  style={{ width: 100, height: 100 }}
                  source={{ uri: this.props.note._attachments.photo.url }}
                />
              ) : null
            ) : null}
            {/* <Button onPress={this.onAddAttachmentPress}><Text>Add attachment</Text></Button> */}
            {/* {
              !this.state.removeAttachment &&
                <Button onPress={this.onRemoveAttachmentPress}><Text>Remove attachment</Text></Button>
            } */}
          </Form>
        </Content>
        {this.props.note && this.props.note._id ? (
          <Footer>
            <Button danger onPress={this.onDeleteButtonPress}>
              <Text>Delete</Text>
            </Button>
          </Footer>
        ) : null}
      </Container>
    );
  }
}
