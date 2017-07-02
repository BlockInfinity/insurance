import React from 'react';
import { StyleSheet, Text, View, FlatList, Button, Picker, TextInput, ActivityIndicator, ListView } from 'react-native';
import { StackNavigator } from 'react-navigation';

const ENDPOINT = 'http://65.52.158.220:8081'

class Login extends React.Component {
  static navigationOptions = {
    title: "Login",
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: 'blue', 
      elevation: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      account: 0
    };
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Styles.container}>
        <Text style={Styles.baseText1}>Insurant</Text>
        <Button style={Styles.item} onPress={() => navigate('InsurantHome')} title={'Go to Insurant Home'}/>
        <Text style={Styles.baseText1}>Insurer</Text>
        <Button style={Styles.item} onPress={() => navigate('InsurerHome')} title={'Go to Insurer Home'}/>
      </View>
    );
  }
}

class InsurantHome extends React.Component {
  static navigationOptions = {
    title: "Insurant Home",
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: 'blue', 
      elevation: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      account: 10,
      dataSource: [
        {key: '12AB', state: 'Requested'},
        {key: '13AB', state: 'Accepted'},
        {key: '14AB', state: 'Confirmed'},
        {key: '15AB', state: 'Accepted'},
        {key: '16AB', state: 'Confirmed'}
      ]
    };
  }

  componentDidMount() {
    //!!!! do be removed
    this.setState({
      isLoading: false,
    })
    return
    //!!!! do be removed

    return fetch(ENDPOINT + '/allInsurances')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.insurances),
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false
        }, function() {
          Alert.alert(
            'Error',
            'An error occured while fetching all insurances! Please try again in a few seconds.',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')}
            ],
            { cancelable: false }
          )
        });
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    const { navigate } = this.props.navigation;
    return (
      <View style={Styles.container}>
        <Text style={Styles.baseText1}>Account:</Text>
        <Text style={Styles.baseText3}>{this.state.account}</Text>
        <Text style={Styles.baseText4}>Insurances:</Text>
        <FlatList style={Styles.list}
          data={this.state.dataSource}
          renderItem={({item}) => 
            <Button style={Styles.item} onPress={() => navigate('InsurantInsurance', item)} title={'Insurance: ' + item.key + ' State: ' + item.state}/>
          }
        />
        <Button style={Styles.item} onPress={() => navigate('InsurantInsurance')} title={'New Insurance'}/>
      </View>
    );
  }
}

class InsurantInsurance extends React.Component {
  static navigationOptions = {
    title: "Insurant Details",
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: 'blue', 
      elevation: null,
    }
  }

  constructor(props) {
    super(props);
    let list  = [];
    for (var i = 1; i <= 365; i++) {
      list.push(i);
    }
    const { params } = props.navigation.state;
    this.state = {
      isLoading: false,
      strength: params && params.insurance ? params.insurance.strength : 0,
      value: params && params.insurance ? params.insurance.value : 0,
      duration: params && params.insurance ? params.insurance.duration : 1,
      geolocation: 12,
      state: params && params.insurance ? params.insurance.state : 'new',
      strengthList: [
        {key: 'Niedrig', value: 0},
        {key: 'Mittel', value: 1},
        {key: 'Hoch', value: 2}
      ],
      valueList: [
        {key: '100.000', value: 100000},
        {key: '250.000', value: 250000},
        {key: '500.000', value: 500000},
        {key: '1.000.000', value: 1000000}
      ],
      durationList: list
    }
  }

  onPress() {
    const { navigate } = this.props.navigation

    //!!!! do be removed
    navigate('InsurantHome')
    return
    //!!!! do be removed

    // check if some other action is currently processing
    if (this.state.isLoading) {
      Alert.alert(
        'Warning',
        'Some other action is currently processing! Please try again in a few seconds.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')}
        ],
        { cancelable: false }
      )
      return
    }

    //////
    // push to server
    //////

    // state == 'new'
    // -> request new insurance
    if (this.state.state === 'new') {
      this.setState({
        isLoading: true
      }, () => {
        return fetch(ENDPOINT + '/requestInsurance', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            strength: this.state.strength,
            value: this.state.value,
            duration: this.state.duration,
            geolocation: this.state.geolocation
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            isLoading: false
          }, () => {
            Alert.alert(
              'Success',
              'New Insurance created!',
              [
                {text: 'OK', onPress: () => navigate('InsurantHome')}
              ],
              { cancelable: false }
            )
          })
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            isLoading: false
          }, () => {
            Alert.alert(
              'Error',
              'New Insurance could not be created! Please try again.',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')}
              ],
              { cancelable: false }
            )
          })
        });
      })
    }

    // state == 'accepted'
    // -> request new insurance
    if (this.state.state === 'accepted') {
      this.setState({
        isLoading: true
      }, () => {
        return fetch(ENDPOINT + '/confirmInsurance', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.state.id
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            isLoading: false
          }, () => {
            Alert.alert(
              'Success',
              'Insurance confirmed!',
              [
                {text: 'OK', onPress: () => navigate('InsurantHome')}
              ],
              { cancelable: false }
            )
          })
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            isLoading: false
          }, () => {
            Alert.alert(
              'Error',
              'Insurance could not be confirmed! Please try again.',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')}
              ],
              { cancelable: false }
            )
          })
        });
      })
    }
  }

  buttonTitle() {
    if (this.state.state === 'new') {
      return 'Create'
    } else if (this.state.state === 'accepted') {
      return 'Confirm'
    } else {
      return 'n/a'
    }
  }

  buttonShow() {
    return this.state.state === 'new' || this.state.state === 'accepted'
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={Styles.container}>
        <Text style={Styles.baseText1}>Strength:</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Picker style={Styles.picker2} enabled={this.state.state === 'new'} selectedValue={this.state.strength}
               onValueChange={(strength) => this.setState({strength})}>
              {this.state.strengthList.map((i) => {
                  return <Picker.Item key={i.key} value={i.value} label={i.key}/>
              })}
            </Picker>
          </View>
        </View>
        <Text style={Styles.baseText4}>Value:</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Picker style={Styles.picker2} enabled={this.state.state === 'new'} selectedValue={this.state.value}
               onValueChange={(value) => this.setState({value})}>
              {this.state.valueList.map((i) => {
                  return <Picker.Item key={i.key} value={i.value} label={i.key}/>
              })}
            </Picker>
          </View>
        </View>
        <Text style={Styles.baseText4}>Duration:</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Picker style={Styles.picker2} enabled={this.state.state === 'new'} selectedValue={this.state.duration}
               onValueChange={(duration) => this.setState({duration})}>
              {this.state.valueList.map((i) => {
                  return <Picker.Item key={i.key} value={i.value} label={i.key}/>
              })}
            </Picker>
          </View>
        </View>
        <Text style={Styles.baseText4}>Geolocation:</Text>
        <Text style={Styles.baseText4}>{this.state.geolocation}</Text>
        {this.buttonShow() && (
          <Button style={Styles.item} onPress={() => this.onPress()} disabled={!this.buttonShow()} title={this.buttonTitle()}/>
        )}
      </View>
    );
  }
}

class InsurerHome extends React.Component {
  static navigationOptions = {
    title: "Insurer Home",
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: 'blue', 
      elevation: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      account: 10,
      dataSource: [
        {key: '12AB', state: 'Requested'},
        {key: '13AB', state: 'Accepted'},
        {key: '14AB', state: 'Confirmed'},
        {key: '15AB', state: 'Accepted'},
        {key: '16AB', state: 'Confirmed'}
      ]
    };
  }

  componentDidMount() {
    //!!!! do be removed
    this.setState({
      isLoading: false,
    })
    return
    //!!!! do be removed

    return fetch(ENDPOINT + '/allInsurances')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.insurances),
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false
        }, function() {
          Alert.alert(
            'Error',
            'An error occured while fetching all insurances! Please try again in a few seconds.',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')}
            ],
            { cancelable: false }
          )
        });
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    const { navigate } = this.props.navigation;
    return (
      <View style={Styles.container}>
        <Text style={Styles.baseText1}>Account:</Text>
        <Text style={Styles.baseText3}>{this.state.account}</Text>
        <Text style={Styles.baseText4}>Insurances:</Text>
        <FlatList style={Styles.list}
          data={this.state.dataSource}
          renderItem={({item}) => 
            <Button style={Styles.item} onPress={() => navigate('InsurerInsurance', item)} title={'Insurance: ' + item.key + ' State: ' + item.state}/>
          }
        />
      </View>
    );
  }
}

class InsurerInsurance extends React.Component {
  static navigationOptions = {
    title: "Insurance Details",
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: 'blue', 
      elevation: null,
    }
  }

  constructor(props) {
    super(props);
    let list  = [];
    for (var i = 1; i <= 365; i++) {
      list.push(i);
    }
    const { params } = props.navigation.state;
    this.state = {
      isLoading: false,
      strength: params && params.insurance ? params.insurance.strength : 0,
      value: params && params.insurance ? params.insurance.value : 0,
      duration: params && params.insurance ? params.insurance.duration : 1,
      geolocation: 12,
      state: params && params.insurance ? params.insurance.state : 'new',
      costs: 100
    }
  }

  onPress() {
    const { navigate } = this.props.navigation

    //!!!! do be removed
    navigate('InsurerHome')
    return
    //!!!! do be removed

    // check if some other action is currently processing
    if (this.state.isLoading) {
      Alert.alert(
        'Warning',
        'Some other action is currently processing! Please try again in a few seconds.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')}
        ],
        { cancelable: false }
      )
      return
    }

    //////
    // push to server
    //////

    // state == 'requested'
    // -> accept insurance
    if (this.state.state === 'requested') {
      this.setState({
        isLoading: true
      }, () => {
        return fetch(ENDPOINT + '/acceptInsurance', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.state.id,
            costs: this.state.costs
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            isLoading: false
          }, () => {
            Alert.alert(
              'Success',
              'Insurance accepted!',
              [
                {text: 'OK', onPress: () => navigate('InsurerHome')}
              ],
              { cancelable: false }
            )
          })
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            isLoading: false
          }, () => {
            Alert.alert(
              'Error',
              'Insurance could not be accepted! Please try again in a few seconds.',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')}
              ],
              { cancelable: false }
            )
          })
        });
      })
    }

    // state == 'confirmed'
    // -> close insurance
    if (this.state.state === 'confirmed') {
      this.setState({
        isLoading: true
      }, () => {
        return fetch(ENDPOINT + '/closeInsurance', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.state.id
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            isLoading: false
          }, () => {
            Alert.alert(
              'Success',
              'Insurance closed!',
              [
                {text: 'OK', onPress: () => navigate('InsurerHome')}
              ],
              { cancelable: false }
            )
          })
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            isLoading: false
          }, () => {
            Alert.alert(
              'Error',
              'Insurance could not be closed! Please try again in a few seconds.',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')}
              ],
              { cancelable: false }
            )
          })
        });
      })
    }
  }

  buttonTitle() {
    if (this.state.state === 'requested') {
      return 'Accept'
    } else if (this.state.state === 'confirmed') {
      return 'Close'
    } else {
      return 'n/a'
    }
  }

  buttonShow() {
    return this.state.state === 'requested' || this.state.state === 'confirmed'
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={Styles.container}>
        <Text style={Styles.baseText1}>Strength:</Text>
        <Text style={Styles.baseText4}>{this.state.strength}</Text>
        <Text style={Styles.baseText4}>Value:</Text>
        <Text style={Styles.baseText4}>{this.state.value}</Text>
        <Text style={Styles.baseText4}>Duration:</Text>
        <Text style={Styles.baseText4}>{this.state.duration}</Text>
        <Text style={Styles.baseText4}>Geolocation:</Text>
        <Text style={Styles.baseText4}>{this.state.geolocation}</Text>
        {this.state.state === 'requested' && (
          <View>
            <Text style={Styles.baseText4}>Costs:</Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(costs) => this.setState({costs})}
              value={this.state.costs}
            /> 
          </View>  
        )}
        {this.buttonShow() && (
          <Button style={Styles.item} onPress={() => this.onPress()} disabled={!this.buttonShow()} title={this.buttonTitle()}/>
        )}
      </View>
    );
  }
}

export default App = StackNavigator({
  Login: { screen: Login },
  InsurantHome: { screen: InsurantHome },
  InsurantInsurance: { screen: InsurantInsurance },
  InsurerHome: { screen: InsurerHome },
  InsurerInsurance: { screen: InsurerInsurance }
});

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7b843',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  baseText1: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  baseText2: {
    fontSize: 15,
  },
  baseText3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  baseText4: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    margin: 40,
    width: 300,
  },
  item: {
    fontSize: 18,
    height: 44,
    color: 'blue'
  },
});
