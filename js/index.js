/**
 *
 * Date: 03-01-2021
 * Author: sanjay
 * Description: Contain code for api call to fetch suggestion and lyrics.
 */

// function for fetching api json data
import { searchSuggestions } from './utils.js';

document.getElementById('lyrics-id').style.display = 'none';
document.getElementById('show-suggestions-id').style.display = 'none';

// Event listner for serach button. Make api call to fetch suggestion and
// popuplate it in suggestion page.
document.getElementById('search-suggestion-id').addEventListener('click', searchSuggestions);
