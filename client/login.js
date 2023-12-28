const form = document.querySelector('form');

form.addEventListener('submit', onSubmit);

async function onSubmit(e){
    e.preventDefault();

    const myObj = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    try{
        const response = await axios.post('http://localhost:3000/user/user-login',myObj);
        console.log(response.data);
        localStorage.setItem('token',response.data.token);
        // redirect...
        window.location.href = './todo.html';
    } catch(err){
        console.log(err)
    }

    form.reset();
}
 