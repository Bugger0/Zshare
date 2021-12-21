const dropZone=document.querySelector(".drop-zone");
const fileInput=document.querySelector("#fileInput")
const browseBtn=document.querySelector(".browseBtn")

const bgProgress=document.querySelector(".bg-progress")
const progressBar=document.querySelector(".progress-bar")
const percentDiv=document.querySelector("#percent");
const progressContainer=document.querySelector(".progress-container")


const toast =document.querySelector(".toast")
const sharingContainer=document.querySelector(".sharing-container")
const fileURLInput=document.querySelector("#fileURL")
const copyBtn=document.querySelector("#copyBtn")
const emailForm=document.querySelector("#emailForm")


const host="https://innshare.herokuapp.com/";
const uploadURL=`${host}api/files`;

const emailURL=`${host}api/files/send`;



const maxAllowedSize=100*1024*1024//100mb


dropZone.addEventListener("dragover",(e)=>{

    e.preventDefault();

    if(!dropZone.classList.contains("dragged"))
    dropZone.classList.add("dragged")
})
dropZone.addEventListener("dragleave",()=>{
    dropZone.classList.remove("dragged")
})
dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files=e.dataTransfer.files;
    if(files.length){
        fileInput.files=files;
        uploadFile()
    }
    
});
fileInput.addEventListener("change",()=>{
    uploadFile();
})

browseBtn.addEventListener('click',()=>{
fileInput.click()
})

copyBtn.addEventListener('click',async (event)=>{
   fileURLInput.select()
  await  navigator.clipboard.writeText(fileURLInput.value)
 showToast("Link Copied");     
})

const uploadFile=()=>{


    if(fileInput.files.length>1){
        resetFileInput();
        showToast("Only upload 1 file!");
        
        return;

    }
    const file=fileInput.files[0];

    if(file.size>maxAllowedSize){
        showToast("Can't upload  file more than 100mb")
        resetFileInput();
        return;

    }

    progressContainer.getElementsByClassName.display="block";

   
    const formData=new FormData();
    formData.append("myfile",file)
    const xhr=new XMLHttpRequest();

    xhr.onreadystatechange=()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            console.log(xhr.response);
            onUploadSuccess(JSON.parse(xhr.response))
        }
    };
    xhr.upload.onprogress=updateProgress;

    xhr.upload.onerror=()=>{
        resetFileInput();
        showToast(`Error in upload : ${xhr.statusText}`)
    }
    
    xhr.open("POST",uploadURL);
    xhr.send(formData)

};
const updateProgress=(e)=>{
    const percent=Math.round((e.loaded/e.total)*100);
bgProgress.getElementsByClassName.width=`${percent}%`;
percentDiv.innerText=percent;
progressBar.getElementsByClassName.transform=`scaleX(${percent/100})`

}
const onUploadSuccess=({file:url})=>{
    resetFileInput();
    emailForm[2].removeAttribute("disabled");

    progressContainer.style.display="none";
    sharingContainer.style.display="block";
    fileURLInput.value=url
};
const resetFileInput=()=>{
    fileInput.value="";
}

emailForm.addEventListener("submit",(e)=>{
e.preventDefault();
const url =(fileURLInput.value)

const formData={
    uuid:url.split("/").splice(-1,1)[0],
    emailTo:emailForm.elements["to-email"].value,
    emailFrom:emailForm.elements["from-email"].value
};
emailForm[2].setAttribute("disabled","true");
console.table(formData);
fetch(emailURL,{
    method:"POST",
    header:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(formData)
})
.then(res=>res.json())
.then(({success})=>{
if(success){
    sharingContainer.style.display="none";
    showToast("Email Sent");

}
})
})


const showToast=(msg)=>{
    toast.innerText=msg;
    toast.style.transform="translateY(-50%,0)";
    clearTimeout(toastTimer);
    setTimeout(()=>{
        toast.style.transform="translateY(-50%,60px)";


    },2000)
}