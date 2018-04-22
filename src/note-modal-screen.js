import React from 'react'
import { Image, CameraRoll, Platform } from 'react-native'
import { Container, Header, Footer, Title, Content, Button, Left, Right, Body,
  Icon, Text, Form, Item, Input } from 'native-base'
import CouchbaseLite from 'react-native-cbl'

export default class NoteModalScreen extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState){
    const navParams = nextProps.navigation.state.params
    return {
      values: navParams && navParams.note ? { ...navParams.note } : {
        title: '',
        text: '',
      }
    }
  }

  state = {}

  onValueChange(field, value) {
    this.setState( ({values}) => ({values: { ...values, [field]: value }}) )
  }

  onSaveButtonPress = async () => {
    const navParams = this.props.navigation.state.params
    if (navParams && navParams.note) {
      await CouchbaseLite.updateDocument(navParams.note._id, {
        title: this.state.values.title,
        text: this.state.values.text,
      })
      if (this.state.attachmentUri) {
        await CouchbaseLite.addAttachment(this.state.attachmentUri, 'photo', navParams.note._id)
      } else if (this.state.removeAttachment) {
        await CouchbaseLite.removeAttachment('photo', navParams.note._id)
      }
    } else {
      const docId = await CouchbaseLite.createDocument({
        title: this.state.values.title,
        text: this.state.values.text,
        createdTime: new Date(),
        docType: 'note',
      })
      if (this.state.attachmentUri) {
        await CouchbaseLite.addAttachment(this.state.attachmentUri, 'photo', docId)
      }
    }
    this.props.navigation.goBack()
  }

  onDeleteButtonPress = async () => {
    await CouchbaseLite.deleteDocument( this.props.navigation.state.params.note._id )
    this.props.navigation.goBack()
  }

  onAddAttachmentPress = async () => {
    const photos = await CameraRoll.getPhotos(
      Platform.select({ios: {first: 1, groupTypes: 'All'}, android: {first: 1}})
    )
    this.setState({
      attachmentUri: photos.edges[0].node.image.uri,
      removeAttachment: false,
    })
  }

  onRemoveAttachmentPress = () => {
    this.setState({
      removeAttachment: true,
      attachmentUri: null,
    })
  }

  render() {
    const navParams = this.props.navigation.state.params
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
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
                onChangeText={value => this.onValueChange('title', value)}
              />
            </Item>
            <Item last>
              <Input
                placeholder="Text"
                value={this.state.values.text}
                onChangeText={value => this.onValueChange('text', value)}
              />
            </Item>
            {
              !this.state.removeAttachment ? (
                this.state.attachmentUri ? (
                  <Image
                    style={{width: 100, height: 100}}
                    source={{uri: this.state.attachmentUri}}
                  />
                ) : (
                  navParams && navParams.note ? (
                    <Image
                      style={{width: 100, height: 100}}
                      source={{uri: navParams.note._attachments.photo.url}}
                    />
                  ) : null
                )
              ) : null
            }
            <Button onPress={this.onAddAttachmentPress}><Text>Add attachment</Text></Button>
            {
              !this.state.removeAttachment &&
                <Button onPress={this.onRemoveAttachmentPress}><Text>Remove attachment</Text></Button>
            }
          </Form>
        </Content>
        {
          navParams && navParams.note ? (
            <Footer>
              <Button danger onPress={this.onDeleteButtonPress}><Text>Delete</Text></Button>
            </Footer>
          ) : null
        }
      </Container>
    )
  }
}
