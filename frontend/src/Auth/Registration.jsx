import React, { Component } from 'react';
// import md5 from 'md5';
import { NavLink } from 'react-router-dom';
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon
} from 'semantic-ui-react';

class Register extends Component {

    // state = {
    //     username: '',
    //     email: '',
    //     password: '',
    //     passwordConfirm: '',
    //     errors: [],
    //     usersRef: firebase.database().ref('users'),
    // }

    // handlerChange = (evt) => {
    //     let value = evt.target.value;
    //     let name = evt.target.name;
    //     this.setState({
    //         [name]: value,
    //     }) 
    // }

    // isFormEmpty = ({username, email, password, passwordConfirm}) => {
    //     return !username.length > 0 || !email.length > 0 || !password.length > 0 || !passwordConfirm.length
    // }

    // isPasswordValid = ({password, passwordConfirm}) => {
    //     return password === passwordConfirm
    // }

    // isFormValid = () => {
    //     let errors = [];
    //     let error;
    //     if (this.isFormEmpty(this.state)) {
    //         error = {
    //             message: 'Fill in all fields'
    //         };
    //         this.setState({
    //             errors: errors.concat(error)
    //         })
    //         return false;
    //     } else if (!this.isPasswordValid(this.state)) {
    //         error = {
    //             message: 'Password is invalid'
    //         };
    //         this.setState({
    //             errors: errors.concat(error)
    //         })
    //         return false
    //     } else {
    //         this.setState({
    //             errors: []
    //         })
    //         return true;
    //     }
    // }

    // saveUser = createdUser => {
    //     return this.state.usersRef.child(createdUser.user.uid).set({
    //         name: createdUser.user.displayName,
    //         avatar: createdUser.user.photoURL,
    //     })
    // }

    // handleSubmit = (evt) => {
    //     evt.preventDefault();
    //     if (this.isFormValid()) {
    //         firebase
    //         .auth()
    //         .createUserWithEmailAndPassword(this.state.email, this.state.password)
    //         .then(createdUser => {
    //             console.log(createdUser);
    //             createdUser.user.updateProfile({
    //                 displayName: this.state.username,
    //                 photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
    //             })
    //             .then(() => {
    //                 this.saveUser(createdUser).then(() => console.log('user saved'))
    //             })
    //             .catch(err => {
    //                 console.error(err);
    //                 this.setState({ errors: this.state.errors.concat(err)})
    //         })
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             this.setState({ errors: this.state.errors.concat(err)})
    //     })
    //     }
    // }

    // handleInput = (errors, inputName) => {
    //     return errors.some(el => el.message.toLowerCase().includes(inputName)) ? 'error' : '';
    // }
   
    render() {
        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{
                    maxWidth: 450
                }}>
                    <Header as='h2' icon color='green' textAlign='center'>
                        <Icon name='comment alternate' color='green'/>
                        Register for Chat
                    </Header>
                    <Form size='large' onSubmit={this.props.funcRegistration}>
                        <Segment stacked>
                            <Form.Input
                            fluid
                            name='user'
                            icon='user'
                            iconPosition='left'
                            placeholder='Username'
                            type='text'
                            onChange={this.props.handlerChange}
                            value={this.props.user}
                            required
                            autoFocus
                            />

                            <Form.Input
                            fluid
                            name='email'
                            icon='mail'
                            iconPosition='left'
                            placeholder='Enter email'
                            type='email'
                            onChange={this.props.handlerChange}
                            value={this.props.email}
                            required
                            />

                            <Form.Input
                            fluid
                            name='password'
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            onChange={this.props.handlerChange}
                            value={this.props.password}
                            required
                            />

                            <Form.Input
                            fluid
                            name='confirmPassword'
                            icon='repeat'
                            iconPosition='left'
                            placeholder='Password Confirm'
                            type='password'
                            onChange={this.props.handlerChange}
                            value={this.props.confirmPassword}
                            required
                            />

                            <Button type='submit' color='green' fluid size='large'>
                                Submit
                            </Button>

                        </Segment>                 
                    </Form>
                    {this.props.error &&
                        <Message>
                        {this.props.error}
                        </Message> }

                        <Message>
                            Already a user?
                            <Button color='green' fluid onClick={this.props.anotherModal}> Login</Button>
                        </Message>      
                        {/* <Button onClick={this.props.anotherModal} color='green' fluid size='large'>
                                Login
                            </Button> */}
                </Grid.Column>        
            </Grid>
        );
    }
}

export default Register;