const PROFILE_URL = '/profiles.json'
let globalData = {}

function ready(callback){
    // in case the document is already rendered
    if (document.readyState!='loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

function loadProfiles(callback) {
    // loading the profile JSON from external source
    fetch(PROFILE_URL)
        .then(response => response.json())
        .then(data => callback(data))
}

function profileClickEvent(e) {
    console.log(e)
    let cohort = this.getAttribute('data-cohort')
    let id = this.getAttribute('data-id')
    console.log(globalData[cohort][id])

    let overlay = document.getElementById('overlay')
    overlay.style.top = (e.clientY) + 'px'
    overlay.style.left = (e.clientX) + 'px'
    overlay.style.display = 'block'
    overlay.style.transform = 'scale(3000,3000)'

    fillIndividualProfile(cohort, id)

    setTimeout(() => {
        document.getElementById('overlay-profile').style.display = 'block'
    }, 200)
    
    /* overlay.style.width = '4000px'
    overlay.style.height = '4000px' */
    
}

function fillIndividualProfile(cohort, id) {
    let  data = globalData[cohort][id]
    let overlayP = document.getElementById('profile-img')
    let overlayD = document.getElementById('profile-desc')

    overlayP.innerHTML = ''
    overlayD.innerHTML = ''

    overlayP.appendChild(populateProfileImage(data, cohort))
    overlayP.appendChild(populateName(data, 'h1'))
    overlayP.appendChild(poppulateTitle(data))
    overlayP.appendChild(populateLinkedIn(data))

    data.description.forEach(d => {
        let p = document.createElement('p')
        p.innerHTML = d

        overlayD.appendChild(p)
    })
}

function overlayBackgroundClickEvent(e) {
    if(e.target.id === 'overlay-profile') {
        e.target.style.display = 'none'
        let o = document.getElementById('overlay')
        o.style.display = 'none'
        o.style.transform = 'scale(1,1)'
        setTimeout(() => {
            o.style.display = 'block'
        }, 200)
    }
}

function fillProfiles(data) {
    globalData = data

    cohortProfile(data, 'cohort_2020')
    cohortProfile(data, 'cohort_2019')
}

function populateLinkedIn(data) {
    if(data.linkedin === "") {
        return document.createElement('span')
    }
    let li_a = document.createElement('a')
    li_a.href = data.linkedin
    li_a.className = 'linkedin_icon'
    li_a.target = '_blank'
    let li = document.createElement('img')
    li.src = 'images/linkedin.svg'
    li_a.appendChild(li)

    return li_a
}

function poppulateTitle(data) {
    let title = document.createElement('span')
    title.className = 'title'
    title.innerHTML = data.title

    return title
}

function populateProfileImage(data, cohort) {
    let img = document.createElement('img')
    img.src = 'images/' + cohort + '/' + data.name.replace(/\s/g, '') + '.png'

    return img
}

function populateName(data, type) {
    let name = document.createElement(type)
    name.className = 'title'
    name.innerHTML = data.name

    return name
}

function cohortProfile(data, cohort) {
    let row = document.createElement('div')
    row.className = 'row'

    data[cohort].forEach((p, idx) => {
        let col = document.createElement('div')
        col.className = 'col-md-3 profile-card'
        col
        //col.addEventListener('click', profileClickEvent, false);

        col.appendChild(populateProfileImage(p, cohort))

        let name = populateName(p, 'h3')
        name.setAttribute('data-cohort', cohort)
        name.setAttribute('data-id', idx)
        name.addEventListener('click', profileClickEvent, false)
        
        col.appendChild(name)
        col.appendChild(poppulateTitle(p))
        col.appendChild(populateLinkedIn(p))

        row.appendChild(col)
    })
    
    
    document.getElementById(cohort).appendChild(row)
}
 
ready(() => {
    loadProfiles(fillProfiles)
    document.getElementById('overlay-profile')
        .addEventListener('click', overlayBackgroundClickEvent)
})

