const my_Jjim = document.querySelector('.my_Jjim')
const my_info = document.querySelector('.my_info')

function ShowJjim(){
    document.querySelector('#card_list').style.display = 'block'
    document.querySelector('#my_information').style.display = 'none'
}

function Showinfo(){
    document.querySelector('#card_list').style.display = 'none'
    document.querySelector('#my_information').style.display = 'block'
}

my_Jjim.addEventListener('click',ShowJjim)
my_info.addEventListener('click',Showinfo)
