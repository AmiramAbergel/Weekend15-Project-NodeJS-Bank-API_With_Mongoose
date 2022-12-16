import fs from 'fs';
const dataURL = '././db/usersList.json';
const usersDataBuffer = fs.readFileSync(dataURL);
export const usersDataJSON = JSON.parse(usersDataBuffer);

export const writeData = (users) => {
    fs.writeFileSync(dataURL, JSON.stringify(users));
};
