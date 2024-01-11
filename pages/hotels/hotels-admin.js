import { API_URL } from "../../settings.js";
import {
    handleHttpErrors,
    makeOptions,
    sanitizeStringWithTableRows,
    sanitizer,
} from "../../utility.js";

const URL = API_URL + "/hotels";
export async function initHotelsAdmin() {
    fetchHotels();
    attachAddHotelButtonListener();

}
function attachAddHotelButtonListener() {
    const saveButton = document.querySelector("#save-add-hotel-button");
    if (saveButton) {
        saveButton.addEventListener("click", addHotel);
    }
}

async function fetchHotels() {
    const data = await fetch(URL, makeOptions("GET", null, false)).then(
        handleHttpErrors
    );

    const hotelRows = data.map(
        (hotel) =>
            `
    <tr>
        <td>${hotel.id}</td>
        <td>${hotel.name}</td>
        <td>${hotel.street}</td>
        <td>${hotel.city}</td>
        <td>${hotel.zip}</td>
        <td>${hotel.country}</td>
        <td>${hotel.noOfRooms}</td>
        <td><button class="hotel-info-btn btn btn-primary" id=hotel_${hotel.id} data-bs-toggle="modal" 
        data-bs-target="#HotelInfoModal">More</button></td>
        <td><button class="add-room-btn btn btn-success" id=add-room_${hotel.id} data-bs-toggle="modal" 
        data-bs-target="#addRoomModal">Add Room</button></td>
        <td><button class="hotel-edit-btn btn btn-warning" id=edit-hotel_${hotel.id} data-bs-toggle="modal" 
        data-bs-target="#editHotelModal">Edit</button></td>
    </tr>
    `
    );
    const tableRowsAsStr = hotelRows.join("");
    const tableRowsElement = document.querySelector("#table-rows");
    tableRowsElement.innerHTML = sanitizeStringWithTableRows(tableRowsAsStr);

    tableRowsElement.querySelectorAll(".hotel-info-btn").forEach((btn) => {
        btn.addEventListener("click", showHotelInfo);
    });
    tableRowsElement.querySelectorAll(".hotel-edit-btn").forEach((btn) => {
        btn.addEventListener("click", editHotelModal);
    });
    tableRowsElement.querySelectorAll(".add-room-btn").forEach((btn) => {
        btn.addEventListener("click", addRoomModal);
    });

}
async function addHotel() {
    event.preventDefault();
    const name = document.querySelector("#modal-hotel-name-add").value;
    const street = document.querySelector("#modal-hotel-street-add").value;
    const zip = document.querySelector("#modal-hotel-zip-add").value;
    const city = document.querySelector("#modal-hotel-city-add").value;
    const country = document.querySelector("#modal-hotel-country-add").value;

    const data = {
        name: name,
        street: street,
        zip: zip,
        city: city,
        country: country,
    };
    await fetch(URL, makeOptions("POST", data)).then(
        handleHttpErrors
    );
    fetchHotels();
}

async function showHotelInfo(evt) {
    if (evt.target.classList.contains("hotel-info-btn")) {
        const hotelId = evt.target.id.split("_")[1];
        const hotel = await fetch(
            URL + "/" + hotelId,
            makeOptions("GET", null, false)
        ).then(handleHttpErrors);
        console.log(hotel);
        console.log(hotel.id);
        document.querySelector(
            "#modal-hotel-id-info"
        ).innerText = `ID: ${hotel.id}`;
        document.querySelector(
            "#modal-hotel-name"
        ).innerText = `Name: ${hotel.name}`;
        document.querySelector("#hotel-info-modal-title").innerText = hotel.name;
        document.querySelector(
            "#modal-hotel-street"
        ).innerText = `Street: ${hotel.street}`;
        document.querySelector("#modal-hotel-zip").innerText = `Zip: ${hotel.zip}`;
        document.querySelector(
            "#modal-hotel-city"
        ).innerText = `City: ${hotel.city}`;
        document.querySelector(
            "#modal-hotel-country"
        ).innerText = `Country: ${hotel.country}`;
        document.querySelector(
            "#modal-hotel-rooms"
        ).innerText = `Number of rooms: ${hotel.noOfRooms}`;
    }
}

async function editHotelModal(evt) {
    if (evt.target.classList.contains("hotel-edit-btn")) {
        const hotelId = evt.target.id.split("_")[1];
        const hotel = await fetch(
            URL + "/" + hotelId,
            makeOptions("GET", null, false)
        ).then(handleHttpErrors);
        console.log(hotel);
        console.log(hotel.id);
        document.querySelector("#modal-hotel-id").value = hotel.id;
        document.querySelector("#modal-hotel-name-edit").value = hotel.name;
        document.querySelector("#modal-hotel-street-edit").value = hotel.street;
        document.querySelector("#modal-hotel-zip-edit").value = hotel.zip;
        document.querySelector("#modal-hotel-city-edit").value = hotel.city;
        document.querySelector("#modal-hotel-country-edit").value = hotel.country;

        document
            .querySelector("#del-button-modal")
            .addEventListener("click", () => deleteHotel(hotelId));
        document
            .querySelector("#save-hotel-button")
            .addEventListener("click", editHotel);
    }
}
async function deleteHotel(id) {
    await fetch(URL + "/" + id, makeOptions("DELETE", null, true)).then(
        handleHttpErrors
    );
    fetchHotels();
}

async function editHotel() {
    event.preventDefault();
    const id = document.querySelector("#modal-hotel-id").value;
    const name = document.querySelector("#modal-hotel-name-edit").value;
    const street = document.querySelector("#modal-hotel-street-edit").value;
    const zip = document.querySelector("#modal-hotel-zip-edit").value;
    const city = document.querySelector("#modal-hotel-city-edit").value;
    const country = document.querySelector("#modal-hotel-country-edit").value;

    const editHotelRequest = {
        id: id,
        name: name,
        street: street,
        zip: zip,
        city: city,
        country: country,
    };
    await fetch(
        URL + "/" + id,
        makeOptions("PATCH", editHotelRequest, true)
    ).then(handleHttpErrors);
    fetchHotels();
}
async function addRoomModal(evt) {
    if (evt.target.classList.contains("add-room-btn")) {
        const hotelId = evt.target.id.split("_")[1];

        document.querySelector("#modal-hotel-id-add").value = hotelId;

        document.querySelector("#save-add-room-button")
            .addEventListener("click", () => addRoom(hotelId));
    }
}
async function addRoom() {
    const roomNumber = document.querySelector("#modal-room-number-add").value;
    const numberOfBeds = document.querySelector("#modal-number-of-beds-add").value;
    const basePrice = document.querySelector("#modal-base-price-add").value;
    const bedPrice = document.querySelector("#modal-bed-price-add").value;
    const hotelId = document.querySelector("#modal-hotel-id-add").value;

    const addRoomRequest = {
        roomNumber: roomNumber,
        numberOfBeds: numberOfBeds,
        basePrice: basePrice,
        bedPrice: bedPrice,
        hotelId: hotelId,
    };
    await fetch(
        API_URL + "/rooms",
        makeOptions("POST", addRoomRequest)
    ).then(handleHttpErrors);
    fetchHotels();
}
