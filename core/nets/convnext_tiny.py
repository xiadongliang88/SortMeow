import torch.nn as nn
from torchvision import models
from core.const.const import num_classes


class ConvNeXtTiny(nn.Module):
    def __init__(self):
        super(ConvNeXtTiny, self).__init__()
        self.model = models.convnext_tiny(weights='IMAGENET1K_V1')
        self.num_features = self.model.classifier[2].in_features
        self.model.classifier[2] = nn.Linear(self.num_features, num_classes)

    def forward(self, x):
        out = self.model(x)
        return out


def pytorch_convnext_tiny():
    return ConvNeXtTiny()
