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
        'X-CSRF-TOKEN': 'qjTsEpsI0m9qCluzPgvPOPIAJDokXT3X87UlGNGX',
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
        'Cookie': '_gcl_au=1.1.260799095.1624429057; _gid=GA1.2.946078649.1624429058; __lt__cid=20c49732-6a7e-4284-9e2b-f4d417beea5c; _CEFT=Q%3D%3D%3D; _fbp=fb.1.1624429058322.797826781; __lt__sid=0d890edf-9ce02b52; _ga=GA1.2.223963477.1624429058; __atuvc=27%7C25%2C26%7C26; __atuvs=60d95c6e4579fe48002; XSRF-TOKEN=eyJpdiI6IkQ2cTVQNkFvcVVFZHZBZmFnbDBYNGc9PSIsInZhbHVlIjoic3R2K2RHdVV4bm5iWGhrQmtyM1NtbVZWeTREMk5sSTBsOTdpVnQ4NDVZTVZZWU1STjRzWElBVzd6NGc4alwvN00iLCJtYWMiOiIzZWU4YWE5OGUxODUyZTliMmZmNGMzMjk4YzBiZGU2NzliMDQ2MDA3N2E1N2U2M2YwOTc2MzUyM2QzMDA4NWVlIn0%3D; laravel_session=eyJpdiI6IlFNZFlVSHlCMDJBYktDaCtuV0hjTnc9PSIsInZhbHVlIjoiTFdCUEFkUlRDaUROUnBkNjZuTk10Rjc0SzVcL2JkV2FaZ1RyTVk5VlpQQUZsN1wvXC80dGpKZjRlZnlsUitKZXN4aSIsIm1hYyI6IjdjNDg3NGJkZDcyOGEyMzQ4ZGM4ZWVjNjI2NTdkNjJmODJkOWJlYTc5M2ViMDFmNDQ0NDc3ZGNmYTRiM2NmOTIifQ%3D%3D; _ga_JYDVKLW8PC=GS1.1.1624857710.25.1.1624859445.60',
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
            desc = soup.find('div', 'container narrow editor editor-style')
            p = desc.find_all('p')
            p_str = ''
            for per_p in p:
                p_str += per_p.text
            desc_list.append(p_str)
        except Exception as e:
            print(p)
            print(e)
        
        images = soup.find_all('img')
        one_class_img = []
        check_file_name = False
        for img in images:
            if '/aerobic-class/inside/' in img.get('src'):
                check_file_name = True
                one_class_img.append(
                    f"https://www.worldgymtaiwan.com{img.get('src')}")

        if check_file_name:
            all_class_imgs.append(one_class_img)
        elif check_file_name is False:
            all_class_imgs.append(['None'])
        
    transfer_json(link_list, day)



def transfer_json(link_list, day):
    global check_amount
    print('transfer to json')
    class_ = []
    try:
        for i in range(len(link_list)):
            classes_info = {
                'weekday': day,
                'class_time': class_time_list[check_amount],
                'class_name_zh': zh_data_list[check_amount],
                'class_name_eng': english_data_list[check_amount],
                'class_teacher': class_instructor_list[check_amount],
                'class_room': classroom_list[check_amount],
                'desc': desc_list[check_amount],
                'img': all_class_imgs[check_amount],
            }
            class_.append(classes_info)
            print(f"finish {check_amount} record")
            check_amount += 1
        all_clean_class_data.append({"class": class_})
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
