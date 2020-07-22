const users = []
// addUser , removeUser , getUser , getUsersInRoom.

const addUser = ({id , username , room}) => {
    // clean the data 
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data 
    if(!username || !room){
        return {
             error: 'Username and room are required!'
        }
    }

    // check for exisiting user 
    const exisitingUser = users.find((user)=>{
          return user.room===room && user.username===username
    })
    // validate username
    if(exisitingUser){
        return {
            error: 'Username is in use!'
        }
    }
    // store users 
    const user = {id , username , room}
    users.push(user);
    return { user }
}




const removeUser=(id)=>{
const index=users.findIndex((user)=>{
     return user.id===id
})
if(index !== -1){
    return users.splice(index , 1)[0];

}
}



addUser({
    id:22 ,
    username: 'Andre   ',
    room: 'South'
})



const getUser=(id)=>{
    const index = users.findIndex((user)=>{
        return user.id===id;
    })
    if(index === -1){
         return {
             error: 'There is no user with this id'
         }
    }
    else {
         return users[index];
    }
}

const getUsersInRoom=(room)=>{
     return users.filter((user)=>{
         return user.room === room;
     })

}
const sameroom = getUsersInRoom('southh');
// console.log(sameroom);
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}