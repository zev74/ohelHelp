import React from "react";
import { useState, useEffect, useContext } from "react";
import { default as MyModal } from "react-native-modal";
import { getFirestore, collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { StyleSheet, Text, View, ScrollView, RefreshControl, Animated, Button } from "react-native";
import RideCard from "../components/RideCard";
import RiderCard from "../components/RiderCard";
import DriverCard from "../components/DriverCard";
import NewAddFab from "../components/NewAddFab";
import { UserContext } from "../UserContext";
import Push from "../components/Push";
import { Timestamp } from "firebase/firestore";

const db = getFirestore();
const ridesCollectionRef = collection(db, "rides");
const myTimestamp = Timestamp.fromDate(new Date());
const liveRides = query(ridesCollectionRef, where("date", ">", new Date()), where("rideStatus", "==", "live"));

console.log(myTimestamp, "thethethethethethethethe");

export default function Home(props) {
    const { user, setUser } = useContext(UserContext);
    const userID = user.uid;
    const [rides, setRides] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [myModalVisible, setMyModalVisible] = useState(false);

    const toggleModal = () => {
        setMyModalVisible(!myModalVisible);
    };

    let renderd = 0;
    let renderdAvailable = 0;
    let renderdDriver = 0;

    const getRides = async () => {
        let tempRidesList = [];
        await getDocs(liveRides)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    tempRidesList.push({ ...doc.data(), id: doc.id });
                    console.log(doc.id);
                });

                console.log("=======================", rides);
                console.log(rides, "also ride");
                console.log(rides.length);
            })
            .catch((err) => {
                console.log(err);
            });
        setRides(tempRidesList);
        setRefreshing(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        getRides();
    };

    useEffect(() => {
        // getRides();
        onSnapshot(
            liveRides,
            (snapshot) => {
                let tempRidesList = [];
                snapshot.docs.forEach((theDoc) => {
                    tempRidesList.push({ ...theDoc.data(), id: theDoc.id });
                });
                console.log(tempRidesList, "_______________________________here_________________________");
                setRides(tempRidesList);
            },
            (error) => {
                console.log(error);
            }
        );
        console.log("Ran");
    }, []);

    //

    return (
        <View>
            <Push />
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {rides.length < 1 ? (
                    <View style={styles.noRidesTextView}>
                        <Text style={styles.noRidesText}>No available rides yet...</Text>
                    </View>
                ) : (
                    rides.map((ride, index) => {
                        console.log(typeof ride.date);
                        if (user.uid === ride.uid) {
                            renderdDriver += 1;
                            return renderdDriver === 1 ? (
                                <>
                                    <Text key='My drives' style={styles.rideHeaders}>
                                        Your drives
                                    </Text>
                                    <DriverCard
                                        seatsAvailable={ride.seatsAvailable}
                                        date={ride.date.seconds}
                                        startLocation={ride.startLocation}
                                        carMake={ride.carMake}
                                        carModel={ride.carModel}
                                        displayName={ride.displayName}
                                        key={`${ride.id}` + `${index}`}
                                        rideID={ride.id}
                                        passengers={ride.passengers}
                                    />
                                </>
                            ) : (
                                <>
                                    <DriverCard
                                        seatsAvailable={ride.seatsAvailable}
                                        date={ride.date.seconds}
                                        startLocation={ride.startLocation}
                                        carMake={ride.carMake}
                                        carModel={ride.carModel}
                                        displayName={ride.displayName}
                                        key={`${ride.id}` + `${index}`}
                                        rideID={ride.id}
                                        passengers={ride.passengers}
                                    />
                                </>
                            );
                        } else {
                            console.log("not my ride");
                        }
                    })
                )}
                {rides.map((ride, index) => {
                    if (user.uid in ride.passengers) {
                        renderdAvailable += 1;

                        return renderdAvailable === 1 ? (
                            <>
                                <Text key='Your Rides' style={styles.rideHeaders}>
                                    Your Rides
                                </Text>
                                <RiderCard
                                    seatsAvailable={ride.seatsAvailable}
                                    date={ride.date.seconds}
                                    startLocation={ride.startLocation}
                                    carMake={ride.carMake}
                                    carModel={ride.carModel}
                                    displayName={ride.displayName}
                                    key={`${ride.id}` + `${index}`}
                                    rideID={ride.id}
                                    passengers={ride.passengers}
                                    approvalStatus={ride.passengers[userID.toString()].approvalStatus}
                                    driverID={ride.uid}
                                />
                            </>
                        ) : (
                            <>
                                <RiderCard
                                    seatsAvailable={ride.seatsAvailable}
                                    date={ride.date.seconds}
                                    startLocation={ride.startLocation}
                                    carMake={ride.carMake}
                                    carModel={ride.carModel}
                                    displayName={ride.displayName}
                                    key={`${ride.id}` + `${index}`}
                                    rideID={ride.id}
                                    passengers={ride.passengers}
                                    approvalStatus={ride.passengers[userID.toString()].approvalStatus}
                                    driverID={ride.uid}
                                />
                            </>
                        );
                    } else {
                        // console.log("not my ride");
                    }
                })}
                {rides.map((ride, index) => {
                    renderd += 1;
                    return renderd === 1 ? (
                        <>
                            <Text key='Avialable Rides' style={styles.rideHeaders}>
                                Avialable Rides
                            </Text>
                            <RideCard
                                seatsAvailable={ride.seatsAvailable}
                                date={ride.date.seconds}
                                startLocation={ride.startLocation}
                                carMake={ride.carMake}
                                carModel={ride.carModel}
                                displayName={ride.displayName}
                                key={`${ride.id}` + `${index}`}
                                rideID={ride.id}
                                passengers={ride.passengers}
                            />
                        </>
                    ) : (
                        <>
                            <RideCard
                                seatsAvailable={ride.seatsAvailable}
                                date={ride.date.seconds}
                                startLocation={ride.startLocation}
                                carMake={ride.carMake}
                                carModel={ride.carModel}
                                displayName={ride.displayName}
                                key={`${ride.id}` + `${index}`}
                                rideID={ride.id}
                                passengers={ride.passengers}
                            />
                        </>
                    );
                    // }
                })}
            </ScrollView>
            <NewAddFab />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        margin: 10
    },
    input: {
        height: 40,
        margin: 10,
        padding: 17,
        borderColor: "#000050",
        borderRadius: 8,
        borderWidth: 1.4
    },
    btn: {
        backgroundColor: "#000050",
        paddingHorizontal: 50,
        paddingVertical: 30,
        borderRadius: 8,
        color: "#FFFFFF",
        margin: 200
    },
    white: {
        color: "#fff"
    },
    rideHeaders: {
        fontSize: 21,
        fontWeight: "bold",
        fontStyle: "italic",
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    requestContainer: {
        width: "94%",
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "navy",
        borderRadius: 12
    },
    approve: {
        height: 40,
        width: 40,
        backgroundColor: "red"
    },
    disapprove: {
        height: 40,
        width: 540,
        backgroundColor: "blue"
    },
    noRidesText: {
        color: "black",
        fontSize: 14
    },
    noRidesTextView: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        paddingVertical: 12,
        backgroundColor: "#D3D3D3",
        width: "70%",
        marginTop: 60,
        marginBottom: "100%",
        borderRadius: 12
    }
});
