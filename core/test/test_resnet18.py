import cv2
import glob
import torch
from torchvision import transforms
from PIL import Image
import numpy as np
from core.nets.resnet18 import resnet18
from core.const import label_name, input_size


def test():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(device)

    net = resnet18()
    net.load_state_dict(torch.load("./model/resnet_epoch_14.pth", weights_only=True))

    im_list = glob.glob("./dataset/test/*/*.jpg")
    np.random.shuffle(im_list)

    net.to(device)

    test_transform = transforms.Compose([
        transforms.Resize(input_size),
        transforms.CenterCrop(input_size),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    for im_path in im_list:
        net.eval()
        im_data = Image.open(im_path)

        inputs = test_transform(im_data)
        inputs = torch.unsqueeze(inputs, dim=0)

        inputs = inputs.to(device)
        outputs = net.forward(inputs)
        # print("outputs", outputs)

        _, pred = torch.max(outputs.data, dim=1)
        print(label_name[pred.cpu().numpy()[0]], " ", im_path)

        # prob, pred = torch.topk(outputs.data, k=3, dim=1)
        # for i in range(3):
        #     print(label_name[pred[0, i].item()], " ", prob[0, i].item(), " ", im_path)

        img = np.asarray(im_data)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        cv2.imshow("img", img)
        cv2.waitKey(0)


if __name__ == "__main__":
    test()
