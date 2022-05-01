import React from "react";
import { useState, useContext } from "react";
import { addDoc, collection, getFirestore } from "@firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UserContext } from "../UserContext";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import toast from "../helpers/toast";

// import DateTimePicker from "@react-native-community/datetimepicker";
import {
    StyleSheet,
    Text,
    View,
    Button,
    ScrollView,
    TouchableOpacity,
    Modal,
    Image,
    TextInput,
    KeyboardAvoidingView,
    StatusBar
} from "react-native";
import {
    Ionicons,
    MaterialCommunityIcons,
    EvilIcons,
    AntDesign,
    FontAwesome5
} from "@expo/vector-icons";

const { user, setUser } = useContext(UserContext);
const db = getFirestore();
const rideCollectionRef = collection(db, "rides");
const [modalVisible, setModalVisible] = useState(false);
const [carMake, setCarMake] = useState("");
const [carModel, setCarModel] = useState("");
const [seatsAvailable, setSeatsAvailable] = useState(0);
const [startLocation, setStartLocation] = useState(null);

const [date, setDate] = useState(new Date());
const [mode, setMode] = useState("date");
const [show, setShow] = useState(false);

const [statusBar, setStatusBar] = useState(false);

const resetAddForm = () => {
    setCarMake("");
    setCarModel("");
    setSeatsAvailable("");
    setStartLocation("");
    setDate(new Date());
};

const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    console.log(currentDate);
};

const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
};

const showDatepicker = () => {
    showMode("date");
};

const showTimepicker = (props) => {
    showMode("time");
};

const handleAddRide = () => {
    addDoc(rideCollectionRef, {
        uid: user.uid,
        carMake: carMake,
        carModel: carModel,
        seatsAvailable: seatsAvailable,
        startLocation: startLocation,
        date: date,
        displayName: user.displayName,
        passengers: {},
        rideStatus: "live"
    })
        .then(() => {
            setModalVisible(false);
            resetAddForm();

            toast("You added a ride successfully!");
            console.log("what");
        })
        .catch((e) => console.log(e));

    console.log("sent");
    // console.log(user);
};

export default function AddFab() {
    return (
        <View>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.fab}
            >
                <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
            <View>
                <Modal
                    onRequestClose={() => setModalVisible(false)}
                    statusBarTranslucent={true}
                    backdropOpacity={0.3}
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.actualSlider}>
                        {/* above the overlay to make modal close on overlay tap */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                            activeOpacity={125}
                        ></TouchableOpacity>

                        <KeyboardAvoidingView
                            behavior='padding'
                            style={styles.whitePart}
                        >
                            <ScrollView keyboardShouldPersistTaps={"handled"}>
                                <View style={styles.modalTitleView}>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Ionicons
                                            name='chevron-down'
                                            size={32}
                                            color='black'
                                            style={styles.requestRideFormIcon}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.title}>
                                        Add ride form
                                    </Text>
                                </View>
                            </ScrollView>
                            <ScrollView keyboardShouldPersistTaps={"handled"}>
                                <View style={styles.nameView}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Car Make'
                                        value={carMake}
                                        name='carMake'
                                        onChangeText={(text) =>
                                            setCarMake(text)
                                        }
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Car Model'
                                        value={carModel}
                                        name='carModel'
                                        onChangeText={(text) =>
                                            setCarModel(text)
                                        }
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Seats available'
                                        value={seatsAvailable}
                                        name='seatsAvailable'
                                        keyboardType='numeric'
                                        onChangeText={(text) =>
                                            setSeatsAvailable(text)
                                        }
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Start location'
                                        value={startLocation}
                                        name='startLocation'
                                        onChangeText={(text) =>
                                            setStartLocation(text)
                                        }
                                    />

                                    <View>
                                        <Button
                                            onPress={showDatepicker}
                                            title='Show date picker!'
                                        />
                                    </View>
                                    <View>
                                        <Button
                                            onPress={showTimepicker}
                                            title='Show time picker!'
                                        />
                                    </View>
                                    <View>
                                        <Text> {date.toString()} </Text>
                                    </View>

                                    {show && (
                                        <DateTimePicker
                                            testID='dateTimePicker'
                                            value={date}
                                            mode={mode}
                                            display='default'
                                            onChange={onChange}
                                        />
                                    )}

                                    <GooglePlacesAutocomplete
                                        placeholder='Search'
                                        onPress={(data, details = null) => {
                                            // 'details' is provided when fetchDetails = true
                                            console.log(data, details);
                                        }}
                                        query={{
                                            key: "AIzaSyC3yifZpv6uKIDgdZwYqol40EXd8Bu_ikg",
                                            language: "en"
                                        }}
                                        styles={{
                                            container: {
                                                flex: 0,
                                                width: "100%",
                                                zIndex: 1
                                            },
                                            listView: {
                                                backgroundColor: "white"
                                            }
                                        }}
                                    />
                                </View>

                                {/* <Text> {user.uid} </Text> */}

                                <TouchableOpacity
                                    onPress={handleAddRide}
                                    style={styles.addRideButton}
                                >
                                    <Text style={styles.addRideButtonText}>
                                        Add ride
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: "400",
        margin: 10
    },
    fab: {
        width: 62,
        height: 62,
        borderRadius: 50,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        position: "absolute",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 5,
        bottom: 20,
        right: 25
    },
    plus: {
        fontSize: 35,
        color: "#fff"
    },
    actualSlider: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
        // backgroundColor: "rgba(0,0,0,0.5)"
    },
    whitePart: {
        backgroundColor: "#fff",
        height: 700,
        width: "100%",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 18,
        zIndex: 4
    },
    closeButton: {
        height: 1000
    },
    avatar: {
        height: 30,
        width: 30,
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 100
    },
    input: {
        padding: 12,
        fontSize: 20,
        borderRadius: 12,
        borderColor: "rgba(0, 0, 0, 0.3)",
        borderWidth: 1,
        margin: 5
    },
    addRideButton: {
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    addRideButtonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "600"
    },
    modalTitleView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5
    }
});

// import React from "react";
// import { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Button,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
//   Image
// } from "react-native";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import {
//   Ionicons,
//   MaterialCommunityIcons,
//   EvilIcons,
//   AntDesign,
//   FontAwesome5
// } from "@expo/vector-icons";
// import { NavigationContainer } from "@react-navigation/native";
// import Register from "../screens/Register";
// import Login from "../screens/Login";

// export default function AddFab(props) {
//   const Tab = createMaterialTopTabNavigator();
//   const [modalVisible, setModalVisible] = useState(false);
//   return (
//     <>
//       <TouchableOpacity
//         onPress={() => setModalVisible(true)}
//         style={styles.fab}
//       >
//         <Text style={styles.plus}>+</Text>
//       </TouchableOpacity>
//       <View>
//         <Modal
//           onRequestClose={() => setModalVisible(false)}
//           statusBarTranslucent={true}
//           backdropOpacity={0.3}
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//         >
//           <View style={styles.actualSlider}>
//             {/* above the overlay to make modal close on overlay tap */}
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setModalVisible(false)}
//               activeOpacity={125}
//             ></TouchableOpacity>
//             <View style={styles.whitePart}>
//               <ScrollView>
//                 <Text style={styles.title}>Add ride</Text>

//                 <View style={styles.carContainer}>
//                   <Image
//                     style={styles.car}
//                     source={require("../images/honda-removebg-preview.png")}
//                   />
//                 </View>

//                 <View style={styles.requestRideFormProfileContainer}>
//                   <View style={styles.requestRideFormNameAvatarContainer}>
//                     {/* <View style={styles.avatar}></View> */}
//                     <Image
//                       style={styles.avatar}
//                       source={require("../images/avatar3.png")}
//                     />
//                     <Text style={styles.title}>Rabbi Driver</Text>
//                   </View>
//                   <Text>2 miles away</Text>
//                 </View>

//                 <View style={styles.rideDetails}>
//                   <View style={styles.rideDetailsLeft}>
//                     <View style={styles.requestRideFormSingleDetail}>
//                       <AntDesign
//                         name="clockcircleo"
//                         size={24}
//                         color="black"
//                         style={styles.icon}
//                       />
//                       <Text>8:30 PM</Text>
//                     </View>

//                     <View style={styles.requestRideFormSingleDetail}>
//                       <MaterialCommunityIcons
//                         name="car-seat"
//                         size={24}
//                         color="black"
//                         style={styles.icon}
//                       />
//                       <Text>4 seats available</Text>
//                     </View>

//                     <View style={styles.requestRideFormSingleDetail}>
//                       <AntDesign
//                         name="clockcircleo"
//                         size={24}
//                         color="black"
//                         style={styles.icon}
//                       />
//                       <Text>8:30 PM</Text>
//                     </View>

//                     <View style={styles.requestRideFormSingleDetail}>
//                       <MaterialCommunityIcons
//                         name="car-seat"
//                         size={24}
//                         color="black"
//                         style={styles.icon}
//                       />
//                       <Text>4 seats available</Text>
//                     </View>
//                   </View>

//                   <View style={styles.rideDetailsRight}>
//                     <View style={styles.requestRideFormSingleDetail}>
//                       <Ionicons
//                         name="md-car-sport-outline"
//                         size={26}
//                         color="black"
//                         style={styles.icon}
//                       />
//                       <Text>Honda Oysey</Text>
//                     </View>
//                     <View style={styles.requestRideFormSingleDetail}>
//                       <Ionicons
//                         name="ios-location-outline"
//                         size={29}
//                         color="black"
//                         style={styles.icon}
//                       />
//                       <Text>770 EP</Text>
//                     </View>

//                     <View style={styles.requestRideFormSingleDetail}>
//                       <Ionicons
//                         name="md-car-sport-outline"
//                         size={26}
//                         color="black"
//                         style={styles.icon}
//                       />
//                       <Text>Honda Oysey</Text>
//                     </View>
//                     <View style={styles.requestRideFormSingleDetail}>
//                       <FontAwesome5
//                         name="redo-alt"
//                         size={24}
//                         color="black"
//                         style={styles.icon}
//                       />
//                       <Text>Round trip</Text>
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.requestRideFormButtonsContainer}>
//                   <TouchableOpacity style={styles.requestRideFormButtons}>
//                     <Text style={styles.requestRideFormButtonsText}>
//                       Watch Ride
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity style={styles.requestRideFormButtons}>
//                     <Text style={styles.requestRideFormButtonsText}>
//                       Requwst Ride
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//                 {/* <NavigationContainer independent={true}>
//                   <Tab.Navigator>
//                     <Tab.Screen
//                       name="Register"
//                       children={() => (
//                         <Register setAuthStatus={props.setAuthStatus} />
//                       )}
//                     />
//                     <Tab.Screen
//                       name="Login"
//                       children={() => (
//                         <Login setAuthStatus={props.setAuthStatus} />
//                       )}
//                     />
//                   </Tab.Navigator>
//                 </NavigationContainer> */}
//               </ScrollView>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 22,
//     fontWeight: "400",
//     margin: 10
//   },
//   fab: {
//     width: 62,
//     height: 62,
//     borderRadius: 50,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     position: "absolute",
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingBottom: 5,
//     bottom: 20,
//     right: 25
//   },
//   plus: {
//     fontSize: 35,
//     color: "#fff"
//   },
//   actualSlider: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0, 0, 0, 0.5)"
//     // backgroundColor: "rgba(0,0,0,0.5)"
//   },
//   whitePart: {
//     backgroundColor: "#fff",
//     height: 700,
//     width: "100%",
//     borderTopLeftRadius: 18,
//     borderTopRightRadius: 18,
//     padding: 18
//   },
//   closeButton: {
//     height: 1000
//   },
//   car: {
//     width: 300,
//     height: 160
//   },
//   carContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "flex-start",
//     marginTop: 25
//   },
//   requestRideFormProfileContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     paddingRight: 25,
//     marginTop: 20
//   },
//   avatar: {
//     height: 30,
//     width: 30,
//     padding: 20,
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     borderRadius: 100
//   },
//   requestRideFormNameAvatarContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center"
//   },
//   rideDetails: {
//     flex: 1,
//     flexDirection: "row",
//     marginTop: 30,
//     paddingHorizontal: 11
//   },
//   rideDetailsLeft: {
//     flex: 1,
//     alignItems: "flex-start",
//     justifyContent: "center",
//     paddingRight: 50
//   },
//   rideDetailsRight: {
//     flex: 1,
//     alignItems: "flex-start",
//     justifyContent: "center"
//   },
//   requestRideFormSingleDetail: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     marginVertical: 8
//   },
//   icon: {
//     marginRight: 10
//   },
//   requestRideFormButtonsContainer: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 1,
//     marginTop: 60
//   },
//   requestRideFormButtons: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 13,
//     width: "40%",
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     borderRadius: 44,
//     marginHorizontal: 8
//   },
//   requestRideFormButtonsText: {
//     color: "#fff",
//     fontSize: 16
//   }
// });
