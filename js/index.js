/**
 *
 * Date: 03-01-2021
 * Author: sanjay
 * Description: Contain code for api call to fetch suggestion and lyrics.
 */

// function for fetching api json data
async function userAction(url) {
  const response = await fetch(url, {
    method: 'GET',
  }).then((result) => result.json());

  const data = await response;
  return data;
}

// variable set number items(songs) to be shown on the suggestion page.
const resultPerPage = 5;
// variable to set page number for pagination
let page = 0;

function hideLyrics() {
  document.getElementById('show-lyrics-id').innerHTML = '';
  document.getElementById('lyrics-id').style.display = 'none';
  document.getElementById('show-suggestions-id').style.display = 'block';
}

function paginationNext() {
  let songList = document.getElementsByClassName('song-detail');
  songList = [...songList];

  if (page < (songList.length / resultPerPage - 1) && songList.length > 0) {
    for (let i = 0; i < resultPerPage; i += 1) {
      songList[resultPerPage * page + i].style.display = 'none';
    }
    page += 1;
    for (let i = 0; i < resultPerPage; i += 1) {
      songList[resultPerPage * page + i].style.display = 'block';
    }
    if (page >= (songList.length / resultPerPage - 1)) {
      document.getElementById('suggestion-next').style.display = 'none';
    }
    document.getElementById('suggestion-back').style.display = '';
  }
}

function paginationBack() {
  let songList = document.getElementsByClassName('song-detail');
  songList = [...songList];

  if (page > 0 && songList.length > 0) {
    for (let i = 0; i < resultPerPage; i += 1) {
      songList[resultPerPage * page + i].style.display = 'none';
    }
    page -= 1;
    for (let i = 0; i < resultPerPage; i += 1) {
      songList[resultPerPage * page + i].style.display = 'block';
    }
    if (page <= 0) {
      document.getElementById('suggestion-back').style.display = 'none';
    }
    document.getElementById('suggestion-next').style.display = '';
  }
}

function addSongListItem(e) {
  const artist = e.target.getAttribute('artist');
  const title = e.target.getAttribute('title');
  const getLyricsUrl = `https://api.lyrics.ovh/v1/${artist}/${title}`;
  const loader = '<div class="loader"></div>';
  document.getElementById('show-lyrics-id').innerHTML = loader;

  if (artist && title) {
    document.getElementById('show-lyrics-id').innerHTML = '';
    userAction(getLyricsUrl).then((data) => {
      document.getElementById('show-suggestions-id').style.display = 'none';
      document.getElementById('show-lyrics-id').innerHTML = '';
      let insertLyrics = `<div class="lyrics-heading"><span class="lyrics-artist">${artist}</span><span class="lyrics-title"> - ${title}</span></div>`;
      if (!data.lyrics) {
        insertLyrics += '<div class="song-lyrics">No Lyrics found</div>';
      } else {
        insertLyrics += `<div class="song-lyrics">${data.lyrics}</div>`;
      }
      document.getElementById('show-lyrics-id').insertAdjacentHTML('beforeend', insertLyrics);
      document.getElementById('lyrics-id').style.display = 'block';
      // Event listner for back button on show lyrics page.
      document.getElementById('hide-lyrics-button').addEventListener('click', hideLyrics);
    });
  }
}

function searchSuggestions(e) {
  e.stopPropagation();
  e.preventDefault();
  const arg = document.getElementById('search-box-id').value;
  const suggestionUrl = `https://api.lyrics.ovh/suggest/${arg}`;

  document.getElementById('show-suggestions-id').style.display = '';
  document.getElementById('show-lyrics-id').innerHTML = '';
  document.getElementById('suggestion-list-id').innerHTML = '';
  document.getElementById('lyrics-id').style.display = 'none';
  document.getElementsByClassName('pagination')[0].style.display = 'none';

  const loader = '<div class="loader"></div>';
  document.getElementById('suggestion-list-id').innerHTML = loader;

  userAction(suggestionUrl).then((data) => {
    if (data.data) {
      document.getElementsByClassName('pagination')[0].style.display = '';
      document.getElementById('suggestion-next').style.display = '';
      document.getElementById('suggestion-list-id').innerHTML = '';
    }

    document.getElementById('suggestion-back').style.display = 'none';
    const list = data.data;
    list.forEach((element) => {
      if (element.artist.name && element.title) {
        const listItem = `<div class="song-detail"><img class="song-thumbnail" src="${element.album.cover}"><span class="song-text"><span class="song-detail-artist">${element.artist.name}</span><span class="song-detail-title"> - ${element.title}</span></span>
                <span class="show-lyrics button"  artist="${element.artist.name}" title="${element.title}">Show Lyrics</span></div>`;
        document.getElementById('suggestion-list-id').insertAdjacentHTML('beforeend', listItem);
      }
    });

    const songList = document.getElementsByClassName('song-detail');

    // eslint-disable-next-line no-plusplus
    for (let i = resultPerPage - 1; i < songList.length; i++) {
      songList[i].style.display = 'none';
    }

    let item = document.getElementsByClassName('show-lyrics');
    item = [...item];

    // Event listener set for every show lyrics button to do api call to fetch song lyrics.
    item.forEach((ele) => {
      ele.addEventListener('click', addSongListItem);
    });
    document.getElementById('suggestion-next').addEventListener('click', paginationNext);

    // Event listeners for Back button on suggestion page
    document.getElementById('suggestion-back').addEventListener('click', paginationBack);
  });
}

document.getElementById('lyrics-id').style.display = 'none';
document.getElementById('show-suggestions-id').style.display = 'none';

// Event listner for serach button. Make api call to fetch suggestion and
// popuplate it in suggestion page.
document.getElementById('search-suggestion-id').addEventListener('click', searchSuggestions);
