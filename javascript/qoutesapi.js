
const category = 'medical';
const apiKey = "b/sWRzbjaZHFAg1p/xnpog==pP8jb9Vdqb0EC3Qx";
const dailyqoute=document.getElementById("daily-qoutes")
fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
  method: 'GET',
  headers: {
    'X-Api-Key': apiKey,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
    let author=data[0].author;
    let quote=data[0].quote;
    let content=` <p>${quote}</p>
    <footer class=" " style="display: flex; justify-content: end;" > ${author}</footer>

 `
 dailyqoute.innerHTML=`${content}`

  
})
.catch(error => {
  console.error('Error:', error);
});
