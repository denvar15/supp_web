import logo from "./logo.png" 

const sendNotification = (body, title, hours) =>
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      new Notification(title ? title : "Your supplement", {
        body: body ? "It's time to take " + body + " gramms" : "This is body",
        icon: logo,
      });
      setTimeout(sendNotification, hours*60*60*1000, body, title, hours);
    }
  });
export function showNotification(body, hours, title, tag) {
  Notification.requestPermission(function (result) {
    if (result === "granted") {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(title, {
          body: body ? "It's time to take " + body + " gramms" : "Buzz! Buzz!",
          icon: logo,
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: title,
          image: logo,
          actions: [
            {
              action: 'https://supp-web.vercel.app/',
              title: 'Maybe, one more scan?',
              icon: logo
            }
          ]
        });
      });
      setTimeout(showNotification, hours*60*60*1000, body, hours, title); 
    }
  });
}

export default sendNotification;
