import cv2
import glob
import torch
from torchvision import transforms
from PIL import Image
import numpy as np
# from resnet import resnet
from torchvision.models import resnet18
from const import label_name, input_size


def test():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(device)

    net = resnet18(weights=None)
    net.load_state_dict(torch.load("./model/resnet_epoch_31.pth", weights_only=True))

    im_list = glob.glob("./dataset/test/*/*.jpg")
    np.random.shuffle(im_list)

    net.to(device)

    test_transform = transforms.Compose([
        transforms.Resize((input_size, input_size)),
        transforms.ToTensor()
    ])

    for im_path in im_list:
        net.eval()
        im_data = Image.open(im_path)

        inputs = test_transform(im_data)
        inputs = torch.unsqueeze(inputs, dim=0)

        inputs = inputs.to(device)
        outputs = net.forward(inputs)
        print("outputs", outputs)

        _, pred = torch.max(outputs.data, dim=1)
        print(label_name[pred.cpu().numpy()[0]], " ", im_path)

        img = np.asarray(im_data)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        cv2.imshow("img", img)
        cv2.waitKey(0)


if __name__ == "__main__":
    test()
