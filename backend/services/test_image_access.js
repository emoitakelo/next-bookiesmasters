import axios from "axios";

const testUrl = "https://media.api-sports.io/football/teams/42.png"; // Arsenal

async function testHeaders() {
    console.log("Testing URL:", testUrl);

    try {
        console.log("1. Testing without headers...");
        await axios.head(testUrl);
        console.log("✅ Success without headers");
    } catch (err) {
        console.log(`❌ Failed without headers: ${err.message}`);
    }

    try {
        console.log("2. Testing with User-Agent...");
        await axios.head(testUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        console.log("✅ Success with User-Agent");
    } catch (err) {
        console.log(`❌ Failed with User-Agent: ${err.message}`);
    }

}

testHeaders();
