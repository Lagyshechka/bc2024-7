const devicesList = document.getElementById('devicesList');
const registerForm = document.getElementById('registerForm');
const takeForm = document.getElementById('takeForm');
const registerResult = document.getElementById('registerResult');
const takeResult = document.getElementById('takeResult');

async function loadDevices() {
  try {
    const res = await fetch('/devices');
    devicesList.innerHTML = '';

    if (!res.ok) {
      devicesList.textContent = 'Не вдалося завантажити список пристроїв.';
      return;
    }

    const devices = await res.json();
    console.log(devices); // <- подивись у консолі браузера, що приходить

    devices.forEach(device => {
      // Тут обовʼязково використай поле саме з відповіді!
      devicesList.innerHTML += `<li>${device.device_name} (серійний номер: ${device.serial_number}) - Користувач: ${device.user_name || 'немає'}</li>`;
    });
  } catch (error) {
    devicesList.textContent = 'Помилка завантаження пристроїв.';
    console.error('loadDevices error:', error);
  }
}

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  registerResult.textContent = '';
  const device_name = document.getElementById('device_name').value.trim();
  const serial_number = document.getElementById('serial_number').value.trim();

  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({device_name, serial_number})
    });
    if (res.ok) {
      registerResult.textContent = 'Пристрій успішно зареєстровано';
      registerForm.reset();
      await loadDevices();  // Чекаємо, щоб оновити список після реєстрації
    } else {
      const err = await res.json();
      registerResult.textContent = `Помилка: ${err.error || res.status}`;
    }
  } catch (e) {
    registerResult.textContent = 'Помилка запиту';
    console.error('registerForm error:', e);
  }
});

takeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  takeResult.textContent = '';
  const user_name = document.getElementById('user_name').value.trim();
  const serial_number = document.getElementById('take_serial_number').value.trim();

  try {
    const res = await fetch('/take', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_name, serial_number})
    });
    if (res.ok) {
      takeResult.textContent = 'Пристрій взято у користування';
      takeForm.reset();
      await loadDevices();  // Оновлюємо список, щоб показати нового користувача
    } else {
      const err = await res.json();
      takeResult.textContent = `Помилка: ${err.error || res.status}`;
    }
  } catch (e) {
    takeResult.textContent = 'Помилка запиту';
    console.error('takeForm error:', e);
  }
});

// Завантажити список пристроїв при завантаженні сторінки
window.addEventListener('DOMContentLoaded', loadDevices);
