import requests
from bs4 import BeautifulSoup
import json
class_time_list = []
zh_data_list = []
english_data_list = []
classroom_list = []
class_instructor_list = []
link_list = []
desc_list = []
all_class_imgs = []
all_clean_class_data = []


def cralwer_all_classes(locate):
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
        'X-CSRF-TOKEN': 'RgIbMVJhkCitDuis1sYHDMeXO7eB9Oztq6aogMk2',
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
        'Cookie': '_gcl_au=1.1.260799095.1624429057; _gid=GA1.2.946078649.1624429058; __lt__cid=20c49732-6a7e-4284-9e2b-f4d417beea5c; _CEFT=Q%3D%3D%3D; _fbp=fb.1.1624429058322.797826781; _gat_gtag_UA_52977744_1=1; _gat_gtag_UA_132963325_17=1; __lt__sid=0d890edf-cc857045; _ga=GA1.2.223963477.1624429058; __atuvc=7%7C25; __atuvs=60d31166bc8fc8d3002; XSRF-TOKEN=eyJpdiI6InN4UzFKejZLbm5scTQ1d1FEa2dacmc9PSIsInZhbHVlIjoiZ0FxZ2xHaFhMcGcxcG1GYmxxWEdJUVpwdHVPWEdCVkxIMG9sbDFsSFZ2MGx6dzhOYUtST0xKdXVCMDd4em9CTSIsIm1hYyI6IjA4NzljYjI1YTEwZTFiYzJhMjlhYThiNWVkMTg2MGVhMjY5ODcxNzUyYjBjNjFlYzMwODdkZGM0NDIzYjdiOWMifQ%3D%3D; laravel_session=eyJpdiI6IjYzaFwvYU5wWHhzWjgzSjMrcVJSNG9nPT0iLCJ2YWx1ZSI6IjNJUjNGOG55T01uZ2NMMm81aVRHV2RvZ1JlYjdBeEJ1SEdvYzJzV1BjMVBaSkx3UXJrTU9Sa1lKeWpmXC92QXhzIiwibWFjIjoiMjdjNzM0NzNhMjM3YjhkY2U3NzQ2Mzc2NjQ2NWI5ZGRkYzRmN2UzODUwYWJiOTBiMzIwMTEyN2M2OTIzZDhkMCJ9; _ga_JYDVKLW8PC=GS1.1.1624445286.2.1.1624445325.21',
    }
    data = {
        'vType': 'Store',
        'vSID': f'{locate}',
        'vWeek': 0,
    }
    res = requests.post(url, headers=headers, data=data)
    html_text = res.text
    clean_needed_data(html_text)


def clean_needed_data(html_text):
    print("cleaing data")
    soup = BeautifulSoup(html_text, "html.parser")
    class_time = soup.find_all("div", "class-time")
    zh_data = soup.find_all("p", "zh")
    eng_data = soup.find_all("p", "en")
    class_instructor = soup.find_all("div", "class-instructor")
    class_room = soup.find_all("div", "class-room")
    class_links = soup.find_all("a")

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

    for link in class_links:
        link_list.append(link.get('href'))
    print(len(link_list))
    cralwer_per_class_page(link_list)


# 寫入desc&images
def cralwer_per_class_page(link_lists):
    # url = f"https://www.worldgymtaiwan.com/aerobic-class-detail/move-lohas"
    # res = requests.get(url)
    # soup = BeautifulSoup(res.text, "html.parser")
    # images = soup.find_all('img')
    # one_class_img = []
    # for img in images:
    #     if '/aerobic-class/inside/' in img.get('src'):
    #         one_class_img.append(f"https://www.worldgymtaiwan.com{img.get('src')}")
    # print(one_class_img)


    for link in link_lists:  #0~97
        url = f"https://www.worldgymtaiwan.com/{link}"
        print(url)
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        try:
            desc = soup.find('section')
            desc_list.append(desc.text)
            images = soup.find_all('img')
            one_class_img = []
            check_file_name = False
            for img in images:
                if '/aerobic-class/inside/' in img.get('src'):
                    check_file_name = True
                    one_class_img.append(f"https://www.worldgymtaiwan.com/{img.get('src')}")

            if check_file_name:
                all_class_imgs.append(one_class_img)
            elif check_file_name is False:
                all_class_imgs.append(['None'])
            
        except AttributeError as e: # 94沒有<section>
            desc = soup.find('div','container narrow editor editor-style')
            p = desc.find_all('p')
            p_str = ''
            for per_p in p:
                p_str += per_p.text
            desc_list.append(p_str)



# TODO:把三個資料分別放到json裡面 再把json放到list
def transfer_json(locate):
    print('transfer to json')
    data_record = 0
    
    for i in range(len(zh_data_list)-1):
        classes_info = {
            'class_time': class_time_list[i],
            'class_name_zh': zh_data_list[i],
            'class_name_eng': english_data_list[i],
            'class_teacher': class_instructor_list[i],
            'class_room': classroom_list[i],
            'desc': desc_list[i],
            'img': all_class_imgs[i],
        }
        all_clean_class_data.append(classes_info)
        data_record += 1
        print(f"finish {data_record} record")
    data = {
        "data": all_clean_class_data
    }
    with open(f'{locate}', 'w', encoding='utf-8') as f:
        f.write(json.dumps(data))
        print("all done!!")




if __name__ == "__main__":
    cralwer_all_classes('taipei-101')
    transfer_json('taipei-101')
    # cralwer_per_class_page(link_list)











# ====================================================
# 重新試Dcard的爬蟲 改一下 還可以
# url = "https://www.dcard.tw/f/softwareengineer"
# data=soup.find("div","sc-1wisey8-0 buWRCP") # find(div, className)(只會有一個大包的)
# da = data.find_all("a", "tgn9uw-3 cUGTXH") #find_all("a", className)裡面包網址跟標題
# print(da)
