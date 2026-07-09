import os
import torch
from nn.nets.resnet18 import resnet18
from nn.dataloader.dataloader import train_dataloader
from nn.const import epoch, lr, batch_size


def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("device: ", device)

    net = resnet18().to(device)

    loss_func = torch.nn.CrossEntropyLoss()

    optimizer = torch.optim.Adam(net.parameters(), lr=lr)

    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=20, eta_min=1e-6) # 余弦退火

    for e in range(epoch):
        print("epoch: ", e)
        net.train()

        for i, data in enumerate(train_dataloader):
            inputs, labels = data
            inputs, labels = inputs.to(device), labels.to(device)

            outputs = net(inputs)

            loss = loss_func(outputs, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            _, pred = torch.max(outputs, dim=1)
            correct = pred.eq(labels.data).cpu().sum()

            print("step: ", i, "loss: ", loss.item(), "correct: ", 1.0 * correct / batch_size)

        scheduler.step()
        print("lr: ", optimizer.state_dict()['param_groups'][0]['lr'])

        if not os.path.exists("./models"):
            os.makedirs("./models")

        torch.save(net.state_dict(), "./models/resnet18_epoch_{}.pth".format(e + 1))


if __name__ == "__main__":
    train()