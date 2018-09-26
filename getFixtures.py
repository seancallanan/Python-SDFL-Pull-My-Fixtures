import argparse
import requests
from bs4 import BeautifulSoup

TARGET_CLUB = 'Terenure Rangers'
fixturesFound = False

try:
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--club', help='Name of club to get fixtures for',
                        action='store')

    FLAGS = parser.parse_args()
    if FLAGS.club:
        TARGET_CLUB = FLAGS.club

except ImportError:
    FLAGS = None
    
def getFixtures():
    SDFLPage = 'http://www.sdfl.ie/upcomingFixtures'
    response = requests.get(SDFLPage)
    sdflSoup = BeautifulSoup(response.text, 'html.parser')

    for competition in sdflSoup('tr', {'class': 'competition'}):
        ageGroup = competition.get_text()
        fixtureRow = competition.next_sibling

        while fixtureRow and ('competition' not in fixtureRow['class']):
            if 'date' in fixtureRow['class']:
                date = fixtureRow.get_text()
            elif 'item' in fixtureRow['class']:
                fixture = getFixture(fixtureRow, sdflSoup)
                if fixture:
                    fixturesFound = True
                    fixture['ageGroup'] = ageGroup
                    fixture['date'] = date
                    printFixture(fixture)

            fixtureRow = fixtureRow.next_sibling

def getFixture(fixtureRow, soup):
    fixture = {}
    fixture['homeClub'] = fixtureRow.find('td', {'class': 'homeClub'}).get_text().strip()
    fixture['awayClub'] = fixtureRow.find('td', {'class': 'awayClub'}).get_text().strip()
    if TARGET_CLUB in fixture['awayClub'] or TARGET_CLUB in fixture['homeClub']:
        fixture['time'] = fixtureRow.find('td', {'class': 'time'}).get_text().strip()
        fixture['referee'] = fixtureRow.find('td', {'class': 'referee'}).get_text().strip()
        fixture['comment'] = fixtureRow.find('td', {'class': 'comment'}).get_text().strip()
        fixture['expand'] = 'r' + fixtureRow.find('span', {'class': 'expand'})['title']
    else:
        return None

    if 'expand' in fixture:
        fixture['venue'] = soup.find('tr', {'class': fixture["expand"]}).get_text().strip()
    return fixture

def printFixture(fixture):
    print('{ageGroup}, {homeClub} v {awayClub}  {date} at {time} {venue} Ref : {referee}'.format(**fixture))

getFixtures()