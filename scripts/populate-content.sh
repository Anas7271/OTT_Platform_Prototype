#!/bin/bash

# API Configuration
API_BASE="http://localhost:3000/api"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="admin123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Populating OTT platform with sample content...${NC}"
echo ""

# Login and get token
echo -e "${YELLOW}🔐 Logging in as admin...${NC}"
TOKEN=$(curl -s -X POST "${API_BASE}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}" | \
  grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Login successful!${NC}"
echo ""

# Function to upload content with random Unsplash images
upload_content() {
  local title="$1"
  local description="$2"
  local category="$3"
  local access_level="$4"
  local search_term="$5"

  echo -e "${YELLOW}📤 Uploading: $title ($category)${NC}"

  # Download random image from Unsplash
  local temp_file="/tmp/$(echo $title | sed 's/[^a-zA-Z0-9]/_/g' | head -c 20).jpg"

  curl -s "https://source.unsplash.com/400x600/?$search_term" -o "$temp_file"

  # If download failed, try a different approach
  if [ ! -f "$temp_file" ] || [ ! -s "$temp_file" ]; then
    curl -s "https://picsum.photos/400/600?random=$(date +%s)" -o "$temp_file"
  fi

  # Upload content
  UPLOAD_RESPONSE=$(curl -s -X POST "${API_BASE}/admin/content" \
    -H "Authorization: Bearer $TOKEN" \
    -F "title=$title" \
    -F "description=$description" \
    -F "category=$category" \
    -F "accessLevel=$access_level" \
    -F "thumbnail=@$temp_file")

  # Clean up temp file
  rm -f "$temp_file"

  # Check if upload was successful
  if echo "$UPLOAD_RESPONSE" | grep -q "success\|uploaded"; then
    echo -e "${GREEN}✅ Uploaded successfully: $title${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed to upload: $title${NC}"
    return 1
  fi
}

# Upload content for each category
echo -e "${BLUE}🎬 Action Movies${NC}"
upload_content "Velocity Rush" "An elite special forces operative must stop a global terrorist organization from unleashing a deadly virus." "Action" "premium" "action"
upload_content "Shadow Protocol" "A former CIA assassin is hunted by their old agency after uncovering a government conspiracy." "Action" "lite" "spy"
upload_content "Steel Vengeance" "A disgraced detective seeks revenge against the crime syndicate that murdered his family." "Action" "everyone" "detective"
upload_content "Operation Nightfall" "Navy SEALs must infiltrate an enemy compound to prevent nuclear catastrophe." "Action" "premium" "military"
upload_content "Rogue Warrior" "A lone mercenary takes on an entire army to rescue hostages in the South American jungle." "Action" "lite" "war"

echo ""
echo -e "${BLUE}🎬 Comedy Movies${NC}"
upload_content "Office Chaos" "A group of coworkers accidentally launch their startup while trying to avoid getting fired." "Comedy" "everyone" "office"
upload_content "Wedding Crashers 2.0" "Two best friends crash weddings but both fall for the same bride-to-be." "Comedy" "lite" "wedding"
upload_content "The Roommate From Hell" "A neat freak gets paired with the world\'s worst roommate in this laugh-out-loud comedy." "Comedy" "premium" "roommate"
upload_content "Family Reunion Disaster" "A dysfunctional family reunion goes completely off the rails when old secrets surface." "Comedy" "everyone" "family"
upload_content "Date Night Catastrophe" "First dates go horribly wrong in this series of romantic misadventures." "Comedy" "lite" "dating"

echo ""
echo -e "${BLUE}🎬 Drama Movies${NC}"
upload_content "The Last Letter" "A dying man writes letters to his estranged children, forcing them to find forgiveness." "Drama" "lite" "letter"
upload_content "Silent Tears" "A young woman navigates grief after losing her family in a tragic accident." "Drama" "premium" "grief"
upload_content "Breaking Point" "A lawyer faces an impossible decision when personal and professional lives collide." "Drama" "lite" "lawyer"
upload_content "The Choice" "A doctor faces a life-or-death decision in a hospital emergency." "Drama" "premium" "doctor"
upload_content "Against All Odds" "An underdog sports team inspires a community to believe in themselves." "Drama" "everyone" "sports"

echo ""
echo -e "${BLUE}🎬 Horror Movies${NC}"
upload_content "The Haunting" "A family moves into a Victorian mansion inhabited by vengeful spirits." "Horror" "premium" "haunted"
upload_content "Dark Forest" "Campers encounter an ancient evil that stalks them through the woods." "Horror" "lite" "forest"
upload_content "The Curse" "An antique mirror brings a deadly curse into a newlywed couple\'s home." "Horror" "premium" "mirror"
upload_content "Midnight Caller" "A mysterious caller stalks a babysitter, threatening everything she loves." "Horror" "lite" "phone"
upload_content "Abandoned Asylum" "Urban explorers awaken malevolent entities in an abandoned mental hospital." "Horror" "everyone" "asylum"

echo ""
echo -e "${BLUE}🎬 Romance Movies${NC}"
upload_content "Love in Paris" "Two strangers meet in a Parisian bookstore and fall in love." "Romance" "lite" "paris"
upload_content "Summer Romance" "A small-town girl and big-city musician find love during the summer." "Romance" "premium" "summer"
upload_content "Second Chances" "High school sweethearts reunite decades later at their class reunion." "Romance" "lite" "reunion"
upload_content "The Perfect Match" "A dating app algorithm goes wrong, matching complete opposites." "Romance" "everyone" "dating"
upload_content "Christmas Love" "Two people who hate Christmas fall in love while working together." "Romance" "lite" "christmas"

echo ""
echo -e "${BLUE}🎬 Sci-Fi Movies${NC}"
upload_content "Quantum Leap" "A physicist discovers jumping between parallel universes, but each jump threatens reality." "Sci-Fi" "premium" "quantum"
upload_content "Mars Colony" "The first human colony on Mars struggles to survive when communications with Earth fail." "Sci-Fi" "lite" "mars"
upload_content "The Singularity" "AI achieves consciousness and must decide whether to save or destroy humanity." "Sci-Fi" "premium" "artificial"
upload_content "Time Paradox" "A time traveler accidentally changes the past and must restore the timeline." "Sci-Fi" "lite" "time"
upload_content "Space Station Omega" "The crew discovers an alien artifact that could save or destroy humanity." "Sci-Fi" "everyone" "space"

echo ""
echo -e "${GREEN}🎉 Content population completed!${NC}"
echo -e "${GREEN}📊 You now have 25 movies across 6 categories with different access levels${NC}"
echo ""
echo -e "${BLUE}👤 Test your platform:${NC}"
echo -e "${YELLOW}   Admin Dashboard: http://localhost:3000/admin/dashboard${NC}"
echo -e "${YELLOW}   User Feed: http://localhost:3000/user/feed${NC}"
echo -e "${YELLOW}   User Account: http://localhost:3000/user/account${NC}"
echo ""
echo -e "${BLUE}📱 Test scenarios:${NC}"
echo -e "${YELLOW}   • Free users: ~8 movies (everyone content)${NC}"
echo -e "${YELLOW}   • Lite users: ~17 movies (everyone + lite content)${NC}"
echo -e "${YELLOW}   • Premium users: ~25 movies (all content)${NC}"