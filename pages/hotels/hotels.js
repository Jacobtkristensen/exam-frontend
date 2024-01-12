import { API_URL } from "../../settings.js";
import {
    handleHttpErrors,
    makeOptions,
    sanitizeStringWithTableRows,
    sanitizer,
} from "../../utility.js";

const URL = API_URL + "/hotels";
export async function initHotels() {
    fetchHotels();
  

}
async function fetchHotels() {
    const data = await fetch(URL, makeOptions("GET", null, false)).then(handleHttpErrors);
    const userExists = localStorage.getItem("roles") == 'USER';
    let bookButton = '';

    const hotelRows = data.map((hotel) => {
        let bookButton = '';
        if (userExists) {
            bookButton = `<td><button class="book-btn btn btn-success" id=book-hotel_${hotel.id} data-bs-toggle="modal" 
            data-bs-target="#bookHotelModal">Book</button></td>`;
        }
        return `
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
                ${bookButton}
            </tr>
        `;
    });
    const tableRowsAsStr = hotelRows.join("");
    const tableRowsElement = document.querySelector("#table-rows");
    tableRowsElement.innerHTML = sanitizeStringWithTableRows(tableRowsAsStr);

    tableRowsElement.querySelectorAll(".hotel-info-btn").forEach((btn) => {
        btn.addEventListener("click", showHotelInfo);
    });

}
async function showHotelInfo(evt) {
    if (evt.target.classList.contains("hotel-info-btn")) {
        const hotelId = evt.target.id.split("_")[1];
        const hotel = await fetch(
            URL + "/" + hotelId,
            makeOptions("GET", null, false)
        ).then(handleHttpErrors);
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