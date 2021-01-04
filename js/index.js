/**
 * 
 * Date: 03-01-2021
 * Author: sanjay
 * Description: Contain code for api call to fetch suggestion and lyrics. 
 */

// function for fetching api json data
async function userAction(url){
    let response = await fetch(url, {
        method: 'GET',
        }).then(response => response.json());

        let data = await response;
        return data;
}

// variable set number items(songs) to be shown on the suggestion page.
const result_per_page = 5;

document.getElementById("lyrics-id").style.display = "none";
document.getElementById("show-suggestions-id").style.display= "none";

//Event listner for serach button. Make api call to fetch suggestion and popuplate it in suggestion page.
document.getElementById("search-suggestion-id").addEventListener("click", function(e){
    e.stopPropagation();
    e.preventDefault();    
    
    let arg = document.getElementById("search-box-id").value;
    let suggestion_url = "https://api.lyrics.ovh/suggest/" + arg;

    document.getElementById("show-suggestions-id").style.display = '';
    document.getElementById("show-lyrics-id").innerHTML = "";
    document.getElementById("suggestion-list-id").innerHTML = "";
    document.getElementById("lyrics-id").style.display = "none";
    document.getElementsByClassName("pagination")[0].style.display = 'none';

    userAction(suggestion_url).then(data => {
        if(data.data){
            document.getElementsByClassName("pagination")[0].style.display = '';
        }

        document.getElementById("suggestion-back").style.display = 'none';
        let list = data.data;
        list.forEach(element => {
            if(element.artist.name&&element.title){
                let listItem = "<div class='song-detail'> <img class='song-thumbnail' src='"+ element.album.cover_small + "'><span class='song-text'><span class='song-detail-artist'>"+element.artist.name+"</span><span class='song-detail-title'> - "+element.title+"</span></span>"
                + "<span class='show-lyrics button'  artist='"+ element.artist.name +"' title='"+ element.title +"'>Show Lyrics</span></div>";
                document.getElementById("suggestion-list-id").insertAdjacentHTML('beforeend',listItem);
            }
        });
    
        let songList = document.getElementsByClassName("song-detail");

        for (let i = result_per_page-1; i < songList.length; i++) {
            songList[i].style.display = "none";
        }
               
        let item = document.getElementsByClassName("show-lyrics");
        item = [...item];
    
        // Event listner set for every show lyrics button to do api call to fetch song lyrics.
        item.forEach(ele => {
            ele.addEventListener("click",function(e){
                let artist = e.target.getAttribute("artist");
                let title = e.target.getAttribute("title");
                let get_lyrics_url = "https://api.lyrics.ovh/v1/" + artist +"/" + title;
                if(artist && title){
                    userAction(get_lyrics_url).then(data => {
        
                        document.getElementById("show-suggestions-id").style.display = 'none';
                        document.getElementById("show-lyrics-id").innerHTML = "";
                        let insertLyrics = "<div class='lyrics-heading'><span class='lyrics-artist'>"+artist+ "</span><span class='lyrics-title'> - " + title + "</span></div>";
                        if(!data.lyrics){
                            insertLyrics += "<div class='song-lyrics'>No Lyrics found</div>";
                        }else{
                            insertLyrics += "<div class='song-lyrics'>" + data.lyrics +"</div>";
                        }
                        document.getElementById("show-lyrics-id").insertAdjacentHTML('beforeend',insertLyrics);
                        document.getElementById("lyrics-id").style.display = "block";
                        
                        // Event listner for back button on show lyrics page.
                        document.getElementById("hide-lyrics-button").addEventListener("click",function(){
                            document.getElementById("show-lyrics-id").innerHTML = "";
                            document.getElementById("lyrics-id").style.display = "none";
                            document.getElementById("show-suggestions-id").style.display = 'block';
                        });
                    });
                }
            });
        });        
    });    
});


// Event listeners for Next button on suggestion page
let songList = document.getElementsByClassName("song-detail");
let page = 0;
document.getElementById("suggestion-next").addEventListener("click", function(){
    if(page<(songList.length/result_per_page - 1)&& songList.length>0){
        for (let i =0; i <result_per_page ; i++) {
            songList[result_per_page*page+i].style.display = "none";
        }
        page++;
        for (let i =0; i <result_per_page ; i++) {
            songList[result_per_page*page+i].style.display = "block";
        }
        if(page>=(songList.length/result_per_page-1)){
            document.getElementById("suggestion-next").style.display = 'none';
        }
        document.getElementById("suggestion-back").style.display = '';
    }
});

// Event listeners for Back button on suggestion page
document.getElementById("suggestion-back").addEventListener("click", function(){
    if(page>0&&songList.length>0){
        for (let i =0; i <result_per_page ; i++) {
            songList[result_per_page*page+i].style.display = "none";
        }
        page--;
        for (let i =0; i <result_per_page ; i++) {
            songList[result_per_page*page+i].style.display = "block";
        }
        if(page <= 0){
            document.getElementById("suggestion-back").style.display = 'none';
        }
        document.getElementById("suggestion-next").style.display = '';
    }
});

export { userAction };