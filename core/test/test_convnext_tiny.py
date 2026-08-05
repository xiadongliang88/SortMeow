import os
import cv2
import glob
import torch
from torchvision import transforms
from PIL import Image
import numpy as np
from core.nets.convnext_tiny import pytorch_convnext_tiny
from core.const import mode, label_name, input_size


def test():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(device)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    core_dir = os.path.dirname(script_dir)
    model_dir = os.path.join(core_dir, "models")
    dataset_dir = os.path.join(core_dir, "dataset", mode, "test")

    print("model_dir", model_dir)

    net = pytorch_convnext_tiny()
    net.load_state_dict(torch.load(os.path.join(model_dir, "convnext_tiny_epoch_100.pth"), weights_only=True))

    im_list = glob.glob(os.path.join(dataset_dir, "*", "*.jpg"))
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

        _, pred = torch.max(outputs.data, dim=1)
        print(label_name[pred.cpu().numpy()[0]], " ", im_path)

        img = np.asarray(im_data)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        img = cv2.resize(img, (200, 200))
        cv2.imshow("img", img)
        cv2.waitKey(0)


if __name__ == "__main__":
    test()
