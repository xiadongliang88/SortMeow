import os
import glob
from torchvision import transforms
from torch.utils.data import DataLoader, Dataset
from PIL import Image
from const import label_name, input_size, batch_size


label_dict = {}

for idx, name in enumerate(label_name):
    label_dict[name] = idx


def default_loader(path):
    img = Image.open(path).convert('RGB')
    w, h = img.size

    if w > 200:  # 如果宽度超过200，可能是错误数据，等比缩放到162
        ratio = 162 / w
        new_h = int(h * ratio)
        img = img.resize((162, new_h), Image.BILINEAR)

    return img


train_transform = transforms.Compose([
    transforms.Resize((input_size)),
    transforms.CenterCrop(input_size),
    transforms.RandomHorizontalFlip(p=0.5),  #  50% 的概率（p=0.5）水平翻转图片
    transforms.RandomRotation(10),  # 轻微旋转
    transforms.ColorJitter(brightness=0.1, contrast=0.1),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


test_transform = transforms.Compose([
    transforms.Resize(input_size),
    transforms.CenterCrop(input_size),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


class MyDataset(Dataset):
    def __init__(self, im_list, transform=None, loader=default_loader):
        super(MyDataset, self).__init__()
        imgs = []

        for im_item in im_list:
            im_label_name = os.path.basename(os.path.dirname(im_item))
            imgs.append([im_item, label_dict[im_label_name]])

        self.imgs = imgs
        self.transform = transform
        self.loader = loader

    def __getitem__(self, index):
        im_path, im_label = self.imgs[index]
        im_data = self.loader(im_path)

        if self.transform is not None:
            im_data = self.transform(im_data)

        return im_data, im_label

    def __len__(self):
        return len(self.imgs)


im_train_list = glob.glob("dataset/train/*/*.jpg")
im_test_list = glob.glob("dataset/test/*/*.jpg")


train_dataset = MyDataset(im_train_list, transform=train_transform)
test_dataset = MyDataset(im_test_list, transform=test_transform)


print("train_dataset", len(train_dataset))
print("test_dataset", len(test_dataset))


train_dataloader = DataLoader(dataset=train_dataset, batch_size=batch_size, shuffle=True, num_workers=4)
test_dataloader = DataLoader(dataset=test_dataset, batch_size=batch_size, shuffle=False, num_workers=4)