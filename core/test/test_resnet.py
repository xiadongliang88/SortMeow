import os
import cv2
import glob
import torch
from torchvision import transforms
from PIL import Image
import numpy as np
from core.nets.resnet import resnet
from core.const import mode, label_name, input_size


def test():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(device)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    core_dir = os.path.dirname(script_dir)
    model_dir = os.path.join(core_dir, "models")
    dataset_dir = os.path.join(core_dir, "dataset", mode, "test")

    print("model_dir", model_dir)

    net = resnet()
    net.load_state_dict(torch.load(os.path.join(model_dir, "resnet_epoch_99.pth"), weights_only=True))

    print("111")

    im_list = glob.glob(os.path.join(dataset_dir, "*", "*.jpg"))
    np.random.shuffle(im_list)

    net.to(device)

    print("222")

    test_transform = transforms.Compose([
        transforms.Resize(input_size),
        transforms.CenterCrop(input_size),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    print("333")

    ary = []
    for im_path in im_list:
        #  print("im_path", im_path)
        net.eval()
        im_data = Image.open(im_path)

        inputs = test_transform(im_data)
        inputs = torch.unsqueeze(inputs, dim=0)

        inputs = inputs.to(device)
        outputs = net.forward(inputs)

        _, pred = torch.max(outputs.data, dim=1)
        print(label_name[pred.cpu().numpy()[0]], " ", im_path)

        result = label_name[pred.cpu().numpy()[0]]

        if result in im_path:
            ary.append(True)
        else:
            ary.append(False)

    print("ary", ary)
    print(sum(ary) / len(ary))

if __name__ == "__main__":
    test()
