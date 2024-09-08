import iziToast from 'izitoast'

export function showError(msg) {
    iziToast.show({
        theme: 'light',
        color: 'red',
        message: msg,
        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBarColor: 'white'
    })
}