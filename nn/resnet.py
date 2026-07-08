import torch.nn as nn
import torch.nn.functional as F


class ResBlock(nn.Module):
    def __init__(self, in_channel, out_channel, stride=1):
        super(ResBlock, self).__init__()

        self.layer = nn.Sequential(
            nn.Conv2d(in_channel, out_channel, kernel_size=3, stride=stride, padding=1),
            nn.BatchNorm2d(out_channel),
            nn.ReLU(),
            nn.Conv2d(out_channel, out_channel, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(out_channel)
        )

        if in_channel != out_channel or stride > 1:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channel, out_channel, kernel_size=1, stride=stride),
                nn.BatchNorm2d(out_channel),
            )
        else:
            self.shortcut = nn.Sequential()

    def forward(self, x):
        out = self.layer(x)
        shortcut = self.shortcut(x)
        out = out + shortcut
        out = F.relu(out)
        return out


class ResNet(nn.Module):
    def make_layer(self, block, out_channel, stride, num_block):
        layer_list = []
        for i in range(num_block):
            if i == 0:
                in_stride = stride
            else:
                in_stride = 1

            layer_list.append(block(self.in_channel, out_channel, in_stride))
            self.in_channel = out_channel
            
        return nn.Sequential(*layer_list)

    def __init__(self, num_classes=67):
        super(ResNet, self).__init__()
        self.in_channel = 32

        self.conv1 = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU()
        )

        self.layer1 = self.make_layer(ResBlock, 64, 2, 2)   # 32 -> 64
        self.layer2 = self.make_layer(ResBlock, 128, 2, 2)  # 64 -> 128
        self.layer3 = self.make_layer(ResBlock, 256, 2, 2)  # 128 -> 256
        self.layer4 = self.make_layer(ResBlock, 512, 2, 2)  # 256 -> 512

        # 添加全局平均池化
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(512, num_classes)

    def forward(self, x):
        out = self.conv1(x)
        out = self.layer1(out)
        out = self.layer2(out)
        out = self.layer3(out)
        out = self.layer4(out)

        # 使用全局平均池化
        out = self.avgpool(out)
        out = out.view(out.size(0), -1)
        out = self.fc(out)

        return out


def resnet():
    return ResNet()