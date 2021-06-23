import requests
from bs4 import BeautifulSoup

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
    headers = {
        'Host': 'www.worldgymtaiwan.com',
        'Connection': 'keep-alive',
        'Content-Length': '92',
        'sec-ch-ua': '"Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        'Accept': '*/*',
        'X-CSRF-TOKEN': 'ijADr5ucAXyXagfYL52skNILTxRJpx06k9X49RZP',
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
        'Cookie': '_gcl_au=1.1.1141961007.1622602850; _fbp=fb.1.1622602850217.952793108; __lt__cid=49a53eed-5a75-4655-b9e6-a3af4149e307; _CEFT=Q%3D%3D%3D; __hstc=22651108.aa7ddc39cbe5e3d3751c3d3305cd4a7a.1622604047055.1622604047055.1622604047055.1; hubspotutk=aa7ddc39cbe5e3d3751c3d3305cd4a7a; __atssc=trello%3B1%2Cgoogle%3B2; _gcl_aw=GCL.1623552690.CjwKCAjwtpGGBhBJEiwAyRZX2tPJlSoLvxykefSq-ZvzhWiEepcZkJzsdOhRiI1HLKmZvpqL1-kX3BoCEikQAvD_BwE; _gac_UA-52977744-1=1.1623552690.CjwKCAjwtpGGBhBJEiwAyRZX2tPJlSoLvxykefSq-ZvzhWiEepcZkJzsdOhRiI1HLKmZvpqL1-kX3BoCEikQAvD_BwE; _gac_UA-132963325-17=1.1623552691.CjwKCAjwtpGGBhBJEiwAyRZX2tPJlSoLvxykefSq-ZvzhWiEepcZkJzsdOhRiI1HLKmZvpqL1-kX3BoCEikQAvD_BwE; _gid=GA1.2.382333975.1624345452; __lt__sid=e7ea5fef-f519905e; _ga=GA1.1.1184336498.1622602851; __atuvc=19%7C22%2C45%7C23%2C4%7C24%2C47%7C25; __atuvs=60d2a32581b3330c004; XSRF-TOKEN=eyJpdiI6IjZPblNLRU14bU45bmpQV1BpZlNrdHc9PSIsInZhbHVlIjoieWZ5dEVDSHdsamFOXC9ydXpBSlpxUGFwTHBMRnVWb2tWR2VLN2g5aVFYV3REaXk5ZlhJc1pHSktSSTJWK3RtK3giLCJtYWMiOiI2YTIxNTQxOWNiMWE2M2UyNDUyNWVmOTA4MzQ1NzY3ZmNiZTNiOWMxNDk0YjYzN2IwYTMwNTY3ZDk1MGI1ZWYxIn0%3D; laravel_session=eyJpdiI6ImphTjRpMkRGVkhCVWVYNW1TSUFQWnc9PSIsInZhbHVlIjoibDB4SHBRV242endVUFZuQ2hoMTVkdGFoYzFobmFQYnFmQjlYTHZ6M3N6ODZ2WXRMVUpnb2t2bVVVdHFUcGhMTyIsIm1hYyI6ImZiM2FhYzUyOGYyZjBiZTRkYzBlZDMwN2IxYmRkNmU5NWVmYzI4MTRjYmNiNTkxZmUzODAzYTEyYjdkZTdhY2YifQ%3D%3D; _ga_JYDVKLW8PC=GS1.1.1624417060.29.1.1624417214.60',
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
                    one_class_img.append(img.get('src'))

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
def transfer_json():
    print('transfer to json')
    data_record = 0
    
    for i in range(len(zh_data_list)-1):
        classes_info = {
            'class_time': class_time_list[i],
            'class_name_zh': zh_data_list[i],
            'class_name_eng': english_data_list[i],
            'class_teacher': classroom_list[i],
            'class_room': class_instructor_list[i],
            'desc': desc_list[i],
            'img': all_class_imgs[i],
        }
        all_clean_class_data.append(classes_info)
        data_record += 1
        print(f"finish {data_record} record")
    data = {
        "data": all_clean_class_data
    }
    with open('all_classes.txt', 'w', encoding='utf-8') as f:
        f.write(data)
        print("all done!!")




if __name__ == "__main__":
    cralwer_all_classes('new-taipei-banqiao-shuangshi')
    # cralwer_per_class_page(link_list)
    transfer_json()











# ====================================================
# 重新試Dcard的爬蟲 改一下 還可以
# url = "https://www.dcard.tw/f/softwareengineer"
# data=soup.find("div","sc-1wisey8-0 buWRCP") # find(div, className)(只會有一個大包的)
# da = data.find_all("a", "tgn9uw-3 cUGTXH") #find_all("a", className)裡面包網址跟標題
# print(da)
