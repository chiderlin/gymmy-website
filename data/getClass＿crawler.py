import requests
from bs4 import BeautifulSoup
import json
class_time_list = []
zh_data_list = []
english_data_list = []
classroom_list = []
class_instructor_list = []
desc_list = []
all_class_imgs = []
all_clean_class_data = []
check_amount = 0


def cralwer_all_classes(locate, day):

    print("in cralwer_all_classes")
    url = "https://www.worldgymtaiwan.com/getStoreClass"

    # request Headers
    # Cookie & X-CSRF-TOKEN 會常變化 要注意
    headers = {
        'Host': 'www.worldgymtaiwan.com',
        'Connection': 'keep-alive',
        'Content-Length': '74',
        'sec-ch-ua': '"Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        'Accept': '*/*',
        'X-CSRF-TOKEN': 'mznD6VZfXywbr5qcpeuyZxPW9F1hpqAqHqkunUBg',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://www.worldgymtaiwan.com',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': f'https://www.worldgymtaiwan.com/aerobic-schedule-list/{locate}',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,zh-CN;q=0.6,ja;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Cookie': '_gcl_au=1.1.260799095.1624429057; _gid=GA1.2.946078649.1624429058; __lt__cid=20c49732-6a7e-4284-9e2b-f4d417beea5c; _CEFT=Q%3D%3D%3D; _fbp=fb.1.1624429058322.797826781; __lt__sid=0d890edf-af845f62; _gat_gtag_UA_52977744_1=1; _gat_gtag_UA_132963325_17=1; XSRF-TOKEN=eyJpdiI6Imt2bnFOMDB2RjhSRmswSUN6WnY3MWc9PSIsInZhbHVlIjoiN3UrOEtleUZrc1pnTTZ1NXZFTGhmSmtLY1BtWUNsOUZyQ0gwUFdGNHo2Nk90ZVhCSEU0dHhBMjVvanllTVU4aSIsIm1hYyI6Ijg4Y2ZiNzFhNWYxZjkzOGMzYTM1YzI4NzE2NzM0YTc1ZWVlMmFkYWQ2ZmVjNzlhMTFiNDEzNzhjNzc2OTUyZWEifQ%3D%3D; laravel_session=eyJpdiI6IjllVlwvSk5aR1ZCUlVvK0VXNGNJTTlBPT0iLCJ2YWx1ZSI6Ijhjb29CV3hkcExDRHo3WTRpdlBEWEI4bHpBU2NoVGROZVUyeGRpR0ZIajMwYlM1N1JCUnlidnc4RjBrZmwwZDciLCJtYWMiOiIzMWY2MTkzZWU2ZTBjYjk0MzFiNDZlOWU4MjNhOTNkZjk4N2QyMDQzZmEwN2FkMjc1YWE2ODMwNWVhY2ZmNTgyIn0%3D; _ga_JYDVKLW8PC=GS1.1.1624755347.16.1.1624755385.22; _ga=GA1.1.223963477.1624429058; __atuvc=27%7C25%2C9%7C26; __atuvs=60d7cc9443a71696003',
    }
    data = {
        'vType': 'Store',
        'vSID': f'{locate}',
        'vWeek': 0,
    }
    res = requests.post(url, headers=headers, data=data)
    html_text = res.text
    clean_needed_data(html_text, day)


def clean_needed_data(html_text, day):
    print("cleaing data")
    soup = BeautifulSoup(html_text, "html.parser")

    weekday = soup.find(attrs={"data-weekday": day})
    class_time = weekday.find_all("div", "class-time")
    zh_data = weekday.find_all("p", "zh")
    eng_data = weekday.find_all("p", "en")
    class_instructor = weekday.find_all("div", "class-instructor")
    class_room = weekday.find_all("div", "class-room")
    class_links = weekday.find_all("a")

    for time in class_time:
        word = time.text
        if '獨' in word or '收' in word:
            word = word.replace('獨家', '').replace('收費', '').replace('收費獨家', '')
        class_time_list.append(word)

    for data in zh_data:
        zh_data_list.append(data.text)

    for data in eng_data:
        english_data_list.append(data.text)

    for data in class_room:
        classroom_list.append(data.text)

    for data in class_instructor:
        class_instructor_list.append(data.text)

    link_list = []
    for link in class_links:
        link_list.append(link.get('href'))

    cralwer_per_class_page(link_list,day)


# 寫入desc&images
def cralwer_per_class_page(link_list,day):

    for link in link_list:
        url = f"https://www.worldgymtaiwan.com{link}"
        print(url)
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        try:
            desc = soup.find('section')
            desc_list.append(desc.text)
        except AttributeError as e:  # 94沒有<section>
            desc = soup.find('div', 'container narrow editor editor-style')
            p = desc.find_all('p')
            p_str = ''
            for per_p in p:
                p_str += per_p.text
            desc_list.append(p_str)
        
        images = soup.find_all('img')
        one_class_img = []
        check_file_name = False
        for img in images:
            if '/aerobic-class/inside/' in img.get('src'):
                check_file_name = True
                one_class_img.append(
                    f"https://www.worldgymtaiwan.com/{img.get('src')}")

        if check_file_name:
            all_class_imgs.append(one_class_img)
        elif check_file_name is False:
            all_class_imgs.append(['None'])
        
    transfer_json(link_list, day)



def transfer_json(link_list, day):
    global check_amount
    print('transfer to json')
    weekday = []
    try:
        for i in range(len(link_list)):
            classes_info = {
                'class_time': class_time_list[check_amount],
                'class_name_zh': zh_data_list[check_amount],
                'class_name_eng': english_data_list[check_amount],
                'class_teacher': class_instructor_list[check_amount],
                'class_room': classroom_list[check_amount],
                'desc': desc_list[check_amount],
                'img': all_class_imgs[check_amount],
            }
            weekday.append(classes_info)
            print(f"finish {check_amount} record")
            check_amount += 1
        all_clean_class_data.append({day: weekday})
        print(len(all_clean_class_data))
    except IndexError as e:
        print(e)
        print(len(desc_list))
        print(len(all_class_imgs))


def write_to_txt(locate):
    data = {
        "data": all_clean_class_data
    }
    with open(f'{locate}', 'w', encoding='utf-8') as f:
        f.write(json.dumps(data))
        print("all done!!")


if __name__ == "__main__":

    week_list = ['monday', 'tuesday', 'wednesday',
                 'thursday', 'friday', 'saturday', 'sunday']
    for day in week_list:
        cralwer_all_classes('taipei-101', day)

    write_to_txt('taipei-101')


# ====================================================
# 重新試Dcard的爬蟲 改一下 還可以
# url = "https://www.dcard.tw/f/softwareengineer"
# data=soup.find("div","sc-1wisey8-0 buWRCP") # find(div, className)(只會有一個大包的)
# da = data.find_all("a", "tgn9uw-3 cUGTXH") #find_all("a", className)裡面包網址跟標題
# print(da)
