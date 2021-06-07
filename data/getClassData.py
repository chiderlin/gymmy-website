import requests
from bs4 import BeautifulSoup

url = "https://www.worldgymtaiwan.com/aerobic-schedule-list/new-taipei-banqiao-shuangshi"


res = requests.get(url)
soup = BeautifulSoup(res.text, "html.parser")
classes = soup.find_all("option")
class_data = ""
for i in classes:
    # print(i.contents[0])
    if i.contents[0] == "請選擇城市":
        class_data += "\n" + i.contents[0] + "\n"
    elif i.contents[0] == "請選擇類別":
        class_data += "\n" + i.contents[0] + "\n"
    elif i.contents[0] == "請選擇課程":
        class_data += "\n" + i.contents[0] + "\n"
    elif i.contents[0] == "ALLEN":
        class_data += "\n有氧課程老師\n" + i.contents[0] + ","
    else:
        class_data += i.contents[0].strip("\n") + ","

# print(class_data)
with open("class_info", "w", encoding="utf-8") as f:
    data = f.write(class_data)