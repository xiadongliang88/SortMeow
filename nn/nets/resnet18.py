import torch.nn as nn
from torchvision import models
from nn.const import num_classes


class resnet18(nn.Module):
    def __init__(self):
        super(resnet18, self).__init__()
        self.model = models.resnet18(weights='IMAGENET1K_V1')
        self.num_features = self.model.fc.in_features
        self.model.fc = nn.Linear(self.num_features, num_classes)

    def forward(self, x):
        out = self.model(x)
        return out


def pytorch_resnet18():
    return resnet18()